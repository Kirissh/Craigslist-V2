import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ListingCard from "@/components/ListingCard";
import { Edit, Upload, Settings, Key, Mail, Lock, User as UserIcon } from "lucide-react";
import { supabase, authAPI, listingsAPI } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const Profile = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("login");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userListings, setUserListings] = useState([]);
  
  // Auth form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  
  // Profile edit state
  const [editedProfile, setEditedProfile] = useState({
    full_name: "",
    location: "",
    bio: "",
    phone: "",
    avatar_url: "",
  });

  // Check if user is authenticated on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data } = await supabase.auth.getSession();
        
        if (data?.session) {
          setIsAuthenticated(true);
          await loadUserData();
          await loadUserListings();
        } else {
          setIsAuthenticated(false);
          setUserData(null);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Failed to check authentication status.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          setIsAuthenticated(true);
          await loadUserData();
          await loadUserListings();
        } else if (event === "SIGNED_OUT") {
          setIsAuthenticated(false);
          setUserData(null);
          setUserListings([]);
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Load user data from Supabase
  const loadUserData = async () => {
    try {
      const userData = await authAPI.getCurrentUser();
      setUserData(userData);
      
      // Initialize edit form with current data
      setEditedProfile({
        full_name: userData.profile?.full_name || "",
        location: userData.profile?.location || "",
        bio: userData.profile?.bio || "",
        phone: userData.profile?.phone || "",
        avatar_url: userData.profile?.avatar_url || "",
      });
    } catch (error) {
      console.error("Error loading user data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load user data.",
      });
    }
  };

  // Load user listings from Supabase
  const loadUserListings = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        const listings = await listingsAPI.getUserListings(userData.user.id);
        setUserListings(listings || []);
      }
    } catch (error) {
      console.error("Error loading user listings:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load your listings.",
      });
    }
  };

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await authAPI.signIn(email, password);
      
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      
      // Clear form
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Login error:", error);
      
      // More descriptive error message
      let errorMessage = "Invalid email or password. Please try again.";
      if (error.message && error.message.includes("network")) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (error.message && error.message.includes("not found")) {
        errorMessage = "User not found. Please check your email or sign up.";
      }
      
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle signup form submission
  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate password strength
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }
      
      await authAPI.signUp(email, password, fullName);
      
      toast({
        title: "Account created!",
        description: "You have successfully created an account. You may now sign in.",
      });
      
      // Switch to login tab after successful signup
      setActiveTab("login");
      
      // Clear form
      setEmail("");
      setPassword("");
      setFullName("");
    } catch (error) {
      console.error("Signup error:", error);
      
      // More descriptive error message
      let errorMessage = "Failed to create an account. Please try again.";
      if (error.message && error.message.includes("email")) {
        errorMessage = "This email is already in use. Please use a different email or try signing in.";
      } else if (error.message && error.message.includes("password")) {
        errorMessage = error.message;
      } else if (error.message && error.message.includes("network")) {
        errorMessage = "Network error. Please check your connection and try again.";
      }
      
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await authAPI.signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out. Please try again.",
      });
    }
  };

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await authAPI.updateProfile(editedProfile);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      
      // Refresh user data
      await loadUserData();
      setIsEditing(false);
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Failed to update your profile. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // If loading, show loading state
  if (isLoading && !userData && !isAuthenticated) {
    return (
      <div className="container py-20 text-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  // If not authenticated, show login/signup form
  if (!isAuthenticated) {
    return (
      <div className="container max-w-md py-20">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {activeTab === "login" ? "Sign In" : "Create Account"}
            </CardTitle>
            <CardDescription className="text-center">
              {activeTab === "login"
                ? "Enter your credentials to access your account"
                : "Join Craigslist to buy and sell in your community"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">Password</label>
                      <a href="#" className="text-sm text-blue-600 hover:underline">
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="John Doe"
                        className="pl-10"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Must be at least 6 characters
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              By continuing, you agree to our{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Otherwise, show the user profile
  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>Profile</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? "Cancel" : "Edit"}
              </Button>
            </div>
            <CardDescription>Manage your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={userData?.profile?.avatar_url} alt={userData?.profile?.full_name} />
                <AvatarFallback className="text-2xl">
                  {userData?.profile?.full_name?.charAt(0) || userData?.email?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button variant="outline" size="sm" className="mb-2">
                  <Upload className="h-4 w-4 mr-2" /> Upload Photo
                </Button>
              )}
              <h2 className="text-xl font-semibold">{userData?.profile?.full_name || 'Anonymous User'}</h2>
              <p className="text-sm text-gray-500">
                Member since {new Date(userData?.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <Input
                    type="text"
                    value={editedProfile.full_name}
                    onChange={(e) =>
                      setEditedProfile({ ...editedProfile, full_name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Location
                  </label>
                  <Input
                    type="text"
                    value={editedProfile.location}
                    onChange={(e) =>
                      setEditedProfile({ ...editedProfile, location: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <Input
                    type="text"
                    value={editedProfile.phone}
                    onChange={(e) =>
                      setEditedProfile({ ...editedProfile, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  <Input
                    type="text"
                    value={editedProfile.bio}
                    onChange={(e) =>
                      setEditedProfile({ ...editedProfile, bio: e.target.value })
                    }
                  />
                </div>
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            ) : (
              <>
                <div>
                  <h3 className="text-sm font-medium mb-1">Email</h3>
                  <p className="text-sm text-gray-600">{userData?.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Location</h3>
                  <p className="text-sm text-gray-600">{userData?.profile?.location || 'Not specified'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Phone</h3>
                  <p className="text-sm text-gray-600">{userData?.profile?.phone || 'Not specified'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">About</h3>
                  <p className="text-sm text-gray-600">{userData?.profile?.bio || 'No bio yet'}</p>
                </div>
                <div className="flex justify-between">
                  <div className="text-center">
                    <p className="text-lg font-semibold">{userListings?.length || 0}</p>
                    <p className="text-xs text-gray-500">Active Listings</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold">0</p>
                    <p className="text-xs text-gray-500">Items Sold</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button variant="outline" className="w-full" asChild>
              <a href="/settings">
                <Settings className="h-4 w-4 mr-2" /> Account Settings
              </a>
            </Button>
            <Button 
              variant="destructive" 
              className="w-full" 
              onClick={handleSignOut}
              disabled={isLoading}
            >
              Sign Out
            </Button>
          </CardFooter>
        </Card>

        {/* Listings tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="active">
            <TabsList className="mb-6">
              <TabsTrigger value="active">Active Listings</TabsTrigger>
              <TabsTrigger value="sold">Sold Items</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              {userListings?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {userListings.map((listing) => (
                    <div key={listing.id}>
                      <ListingCard listing={listing} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-500">You don't have any active listings.</p>
                  <Button className="mt-4" asChild>
                    <a href="/post-ad">Create Your First Listing</a>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="sold">
              <div className="p-8 text-center">
                <p className="text-gray-500">No sold items to display.</p>
              </div>
            </TabsContent>

            <TabsContent value="favorites">
              <div className="p-8 text-center">
                <p className="text-gray-500">No favorite items to display.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;

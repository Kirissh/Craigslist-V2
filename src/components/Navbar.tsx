import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Bell, Menu, User } from "lucide-react";
import { supabase } from "@/lib/api";

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all SF bay area");
  const [selectedCategory, setSelectedCategory] = useState("for sale");
  
  // Check authentication on component mount
  React.useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setIsAuthenticated(!!session);
        }
      );
      
      return () => {
        authListener.subscription.unsubscribe();
      };
    };
    
    checkAuth();
  }, []);
  
  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/browse/for-sale?q=${searchQuery}&location=${selectedLocation}`);
  };
  
  return (
    <>
      {/* Top navigation bar */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and location */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center mr-4">
                <span className="text-2xl font-bold text-purple-700">cl</span>
              </Link>
              
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="border-none shadow-none h-9 pl-2 pr-1 text-sm">
                  <SelectValue placeholder="all SF bay area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all SF bay area">all SF bay area</SelectItem>
                  <SelectItem value="san francisco">san francisco</SelectItem>
                  <SelectItem value="south bay">south bay</SelectItem>
                  <SelectItem value="east bay">east bay</SelectItem>
                  <SelectItem value="peninsula">peninsula</SelectItem>
                  <SelectItem value="north bay">north bay</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Search */}
            <div className="hidden md:flex items-center flex-1 max-w-lg mx-4">
              <form onSubmit={handleSearch} className="relative w-full">
                <Input
                  type="text"
                  placeholder="search craigslist"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-3 pr-10 h-9 text-sm focus-visible:ring-offset-0"
                />
                <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <Search className="h-4 w-4 text-gray-500" />
                </button>
              </form>
            </div>
            
            {/* Nav links */}
            <div className="flex items-center">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/post-ad" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50">
                  post
                </Link>
              </Button>
              
              {isAuthenticated ? (
                <>
                  <Button variant="ghost" size="sm" className="relative" asChild>
                    <Link to="/messages">
                      <Bell className="h-5 w-5" />
                      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                    </Link>
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="ml-1" asChild>
                    <Link to="/profile">
                      <User className="h-5 w-5" />
                    </Link>
                  </Button>
                </>
              ) : (
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/profile" className="text-gray-600 hover:text-gray-800 hover:bg-gray-50">
                    sign in
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Category bar */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex items-center overflow-x-auto py-2 space-x-4 text-sm">
            <Link to="/browse/community" className="whitespace-nowrap text-gray-600 hover:text-blue-600 hover:underline">community</Link>
            <Link to="/browse/services" className="whitespace-nowrap text-gray-600 hover:text-blue-600 hover:underline">services</Link>
            <Link to="/browse/discussion" className="whitespace-nowrap text-gray-600 hover:text-blue-600 hover:underline">discussion forums</Link>
            <Link to="/browse/housing" className="whitespace-nowrap text-gray-600 hover:text-blue-600 hover:underline">housing</Link>
            <Link to="/browse/for-sale" className="whitespace-nowrap text-gray-600 hover:text-blue-600 hover:underline">for sale</Link>
            <Link to="/browse/jobs" className="whitespace-nowrap text-gray-600 hover:text-blue-600 hover:underline">jobs</Link>
            <Link to="/browse/gigs" className="whitespace-nowrap text-gray-600 hover:text-blue-600 hover:underline">gigs</Link>
            <Link to="/browse/resumes" className="whitespace-nowrap text-gray-600 hover:text-blue-600 hover:underline">resumes</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;

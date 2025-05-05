import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Upload, Image as ImageIcon, Sparkles, MapPin } from "lucide-react";
import { listingsAPI, supabase } from "@/lib/api";

// Mock countries and cities data
const countries = [
  { id: "1", name: "United States" },
  { id: "2", name: "Canada" },
  { id: "3", name: "United Kingdom" },
  { id: "4", name: "Australia" },
  { id: "5", name: "Germany" },
];

const cities = {
  "1": [
    { id: "101", name: "New York" },
    { id: "102", name: "Los Angeles" },
    { id: "103", name: "Chicago" },
  ],
  "2": [
    { id: "201", name: "Toronto" },
    { id: "202", name: "Vancouver" },
    { id: "203", name: "Montreal" },
  ],
  "3": [
    { id: "301", name: "London" },
    { id: "302", name: "Manchester" },
    { id: "303", name: "Birmingham" },
  ],
  "4": [
    { id: "401", name: "Sydney" },
    { id: "402", name: "Melbourne" },
    { id: "403", name: "Brisbane" },
  ],
  "5": [
    { id: "501", name: "Berlin" },
    { id: "502", name: "Hamburg" },
    { id: "503", name: "Munich" },
  ],
};

interface ImageFile {
  file: File;
  preview: string;
}

interface Category {
  id: string;
  name: string;
  icon?: string;
  count?: number;
}

const PostAd = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<ImageFile[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [availableCities, setAvailableCities] = useState<{id: string, name: string}[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSuggested, setAiSuggested] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);

      // Subscribe to auth state changes
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

  // Redirect if not authenticated
  useEffect(() => {
    if (isAuthenticated === false) {
      // Only redirect after we've checked auth status
      navigate('/');
      alert('Please log in to post an ad.');
    }
  }, [isAuthenticated, navigate]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch from Supabase
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');

        if (error) {
          console.error('Error fetching categories:', error);
          return;
        }

        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleCountryChange = (value: string) => {
    setCountry(value);
    setCity("");
    setAvailableCities(cities[value as keyof typeof cities] || []);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setImages((prevImages) => [...prevImages, ...filesArray]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const generateWithAI = async () => {
    if (!title.trim() || images.length === 0) {
      alert("Please add at least one image and a title for AI suggestions.");
      return;
    }

    setIsGenerating(true);
    setErrorMessage("");

    try {
      // Convert the first image to base64 for the AI
      const imageFile = images[0].file;
      const reader = new FileReader();
      
      reader.onload = async () => {
        try {
          // Call the API to generate content
          const result = await listingsAPI.generateAdContent(
            title,
            description,
            category
          );

          // Update form with AI suggestions
          if (result && result.description) {
            setDescription(result.description);
            if (result.title && result.title !== title) {
              setTitle(result.title);
            }
            setAiSuggested(true);
          }
        } catch (error) {
          console.error('Error generating content:', error);
          setErrorMessage("Failed to generate AI content. Please try again or proceed with manual entry.");
        } finally {
          setIsGenerating(false);
        }
      };

      reader.onerror = () => {
        setIsGenerating(false);
        setErrorMessage("Failed to process image for AI analysis.");
      };

      reader.readAsDataURL(imageFile);
    } catch (error) {
      console.error('Error in generateWithAI:', error);
      setIsGenerating(false);
      setErrorMessage("An error occurred while processing your request.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please log in to post an ad.');
      navigate('/');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    
    try {
      // Upload images to Supabase storage
      const imageUrls = await Promise.all(
        images.map(async (img, index) => {
          const fileExt = img.file.name.split('.').pop();
          const fileName = `${Date.now()}-${index}.${fileExt}`;
          const filePath = `listings/${fileName}`;

          // Upload file
          const { error: uploadError, data } = await supabase.storage
            .from('images')
            .upload(filePath, img.file, {
              cacheControl: '3600',
              upsert: false,
            });

          if (uploadError) {
            throw new Error(`Error uploading image: ${uploadError.message}`);
          }

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(filePath);

          // Update progress
          setUploadProgress(Math.round(((index + 1) / images.length) * 50));
          
          return publicUrl;
        })
      );

      // Create listing in database
      const listingData = {
        title,
        description,
        price: parseFloat(price),
        images: imageUrls,
        category_id: category,
        location: city ? `${cities[country as keyof typeof cities].find(c => c.id === city)?.name}, ${countries.find(c => c.id === country)?.name}` : countries.find(c => c.id === country)?.name,
        country: countries.find(c => c.id === country)?.name,
        city: cities[country as keyof typeof cities].find(c => c.id === city)?.name,
      };

      setUploadProgress(75);
      
      // Submit to API
      const result = await listingsAPI.createListing(listingData);
      
      setUploadProgress(100);
      
      // Navigate to the listing page or home page
      alert("Ad posted successfully!");
      navigate("/");
      
    } catch (error) {
      console.error('Error creating listing:', error);
      setErrorMessage("Failed to create listing. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Don't render anything while checking auth or redirecting
  }

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">Post a New Ad</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Images */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Images</CardTitle>
              <CardDescription>
                Upload clear photos of your item (max 5 images)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {images.map((img, index) => (
                  <div key={index} className="relative rounded-md overflow-hidden h-32">
                    <img
                      src={img.preview}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => removeImage(index)}
                      type="button"
                    >
                      ×
                    </Button>
                  </div>
                ))}

                {images.length < 5 && (
                  <label className="border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center h-32 cursor-pointer hover:bg-gray-50">
                    <div className="flex flex-col items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                      <span className="mt-2 text-sm text-gray-500">Add Image</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Right column - Ad details */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Ad Details</CardTitle>
              <CardDescription>
                Provide information about your item
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Title*
                </label>
                <Input
                  type="text"
                  placeholder="Enter a descriptive title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium">
                    Description*
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateWithAI}
                    disabled={isGenerating || !title || images.length === 0}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />{" "}
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" /> Generate with AI
                      </>
                    )}
                  </Button>
                </div>
                <Textarea
                  placeholder="Describe your item in detail"
                  className="min-h-32"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
                {aiSuggested && (
                  <p className="text-xs text-gray-500 mt-1">
                    AI-generated description. Feel free to edit it.
                  </p>
                )}
                {errorMessage && (
                  <p className="text-xs text-red-500 mt-1">
                    {errorMessage}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Price*
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      className="pl-8"
                      min="0"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category*
                  </label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div>
                <label className="block text-sm font-medium mb-3">
                  Location*
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Select
                      value={country}
                      onValueChange={handleCountryChange}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.id} value={country.id}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Select
                      value={city}
                      onValueChange={setCity}
                      disabled={!country}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a city" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCities.map((city) => (
                          <SelectItem key={city.id} value={city.id}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                className="w-full gradient-purple"
                disabled={isSubmitting || isGenerating}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Posting Ad ({uploadProgress}%)
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" /> Post Ad
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default PostAd;

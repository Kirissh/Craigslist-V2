
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Search, Sliders } from "lucide-react";
import { categories } from "@/data/mockData";
import { useState } from "react";

const SearchBar = () => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="w-full bg-white rounded-xl shadow-md p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="What are you looking for?"
            className="pl-10"
          />
        </div>

        <div className="w-full md:w-64">
          <Select>
            <SelectTrigger>
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                <SelectValue placeholder="Location" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new-york">New York, NY</SelectItem>
              <SelectItem value="los-angeles">Los Angeles, CA</SelectItem>
              <SelectItem value="chicago">Chicago, IL</SelectItem>
              <SelectItem value="houston">Houston, TX</SelectItem>
              <SelectItem value="miami">Miami, FL</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-64">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button className="gradient-purple">
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
        
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Sliders className="h-4 w-4" />
        </Button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
          <div>
            <label className="text-sm font-medium mb-1 block">
              Price Range
            </label>
            <div className="flex gap-2 items-center">
              <Input type="number" placeholder="Min" />
              <span className="text-gray-500">to</span>
              <Input type="number" placeholder="Max" />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">
              Distance (miles)
            </label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Any distance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">Within 5 miles</SelectItem>
                <SelectItem value="10">Within 10 miles</SelectItem>
                <SelectItem value="25">Within 25 miles</SelectItem>
                <SelectItem value="50">Within 50 miles</SelectItem>
                <SelectItem value="100">Within 100 miles</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">
              Sort By
            </label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Newest first" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="price-low">Price: Low to high</SelectItem>
                <SelectItem value="price-high">Price: High to low</SelectItem>
                <SelectItem value="distance">Distance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;

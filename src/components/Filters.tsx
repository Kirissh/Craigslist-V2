import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input } from "@/components/ui/input";

// Define the props interface
interface FiltersProps {
  onFilterChange?: (filters: Record<string, any>) => void;
  category?: string;
}

const Filters = ({ onFilterChange, category = 'for-sale' }: FiltersProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // State for filters
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [distance, setDistance] = useState(searchParams.get('distance') || '');
  const [zipCode, setZipCode] = useState(searchParams.get('postal') || '');
  
  // Checkboxes
  const [searchTitlesOnly, setSearchTitlesOnly] = useState(searchParams.get('searchTitlesOnly') === 'true');
  const [hasImage, setHasImage] = useState(searchParams.get('hasImage') === 'true');
  const [postedToday, setPostedToday] = useState(searchParams.get('postedToday') === 'true');
  const [hideDuplicates, setHideDuplicates] = useState(searchParams.get('hideDuplicates') === 'true');
  
  // Categories with counts
  const categories = [
    { id: "general", name: "general for sale", count: 30259 },
    { id: "cars", name: "cars & trucks", count: 26496 },
    { id: "furniture", name: "furniture", count: 25358 },
    { id: "household", name: "household items", count: 19107 },
    { id: "auto", name: "auto parts", count: 16906 },
    { id: "electronics", name: "electronics", count: 12837 },
    { id: "sporting", name: "sporting", count: 8542 },
  ];
  
  // Handle checkbox change
  const handleCheckboxChange = (name: string, checked: boolean) => {
    const params = new URLSearchParams(location.search);
    if (checked) {
      params.set(name, 'true');
    } else {
      params.delete(name);
    }
    
    navigate({
      pathname: location.pathname,
      search: params.toString()
    }, { replace: true });
    
    // Update local state
    switch (name) {
      case 'searchTitlesOnly':
        setSearchTitlesOnly(checked);
        break;
      case 'hasImage':
        setHasImage(checked);
        break;
      case 'postedToday':
        setPostedToday(checked);
        break;
      case 'hideDuplicates':
        setHideDuplicates(checked);
        break;
    }
  };

  // Handle category click
  const handleCategoryClick = (categoryId: string) => {
    // If we're already in a main category, navigate to its subcategory
    const currentPath = location.pathname;
    const pathParts = currentPath.split('/');
    const mainCategory = pathParts[2];
    
    if (mainCategory) {
      navigate(`/browse/${mainCategory}/${categoryId}`);
    } else {
      // Fallback to for-sale if no main category is found
      navigate(`/browse/for-sale/${categoryId}`);
    }
  };
  
  // Apply filters
  const applyFilters = () => {
    const params = new URLSearchParams(location.search);
    
    if (minPrice) params.set('minPrice', minPrice);
    else params.delete('minPrice');
    
    if (maxPrice) params.set('maxPrice', maxPrice);
    else params.delete('maxPrice');
    
    if (distance) params.set('distance', distance);
    else params.delete('distance');
    
    if (zipCode) params.set('postal', zipCode);
    else params.delete('postal');
    
    navigate({
      pathname: location.pathname,
      search: params.toString()
    });
    
    if (onFilterChange) {
      onFilterChange({
        minPrice, maxPrice, distance, postal: zipCode,
        hasImage, postedToday, searchTitlesOnly, hideDuplicates
      });
    }
  };
  
  // Reset all filters
  const resetFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setDistance('');
    setZipCode('');
    setSearchTitlesOnly(false);
    setHasImage(false);
    setPostedToday(false);
    setHideDuplicates(false);
    
    navigate({
      pathname: location.pathname,
      search: ''
    });
  };

  return (
    <div className="filters text-sm">
      <h2 className="text-lg font-normal mb-4 text-gray-900">
        {category.includes('-') 
          ? category.replace(/-/g, ' ') 
          : category}
      </h2>
      
      {/* Categories */}
      <ul className="space-y-1 mb-6">
        {categories.map((cat) => (
          <li key={cat.id} className="flex justify-between">
            <button
              onClick={() => handleCategoryClick(cat.id)}
              className="text-blue-600 hover:underline text-left"
            >
              {cat.name}
            </button>
            <span className="text-gray-500">{cat.count}</span>
          </li>
        ))}
        <li>
          <button 
            className="text-blue-600 hover:underline text-left"
            onClick={() => console.log("Show more")}
          >
            + show 40 more
          </button>
        </li>
      </ul>
      
      {/* Distance */}
      <div className="mb-5">
        <h3 className="font-bold mb-2">miles from location</h3>
        <Input
          type="number"
          placeholder="miles"
          className="w-24 mb-2 h-8 rounded-none border-gray-300"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
        />
        <Input
          type="text"
          placeholder="from zip"
          className="w-full h-8 rounded-none border-gray-300"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
        />
      </div>
      
      {/* Price */}
      <div className="mb-5">
        <h3 className="font-bold mb-2">price</h3>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="min"
            className="w-24 h-8 rounded-none border-gray-300"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <span>to</span>
          <Input
            type="number"
            placeholder="max"
            className="w-24 h-8 rounded-none border-gray-300"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>
      
      {/* Checkboxes */}
      <div className="space-y-1 mb-5">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="searchTitlesOnly"
            checked={searchTitlesOnly}
            onChange={(e) => handleCheckboxChange('searchTitlesOnly', e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="searchTitlesOnly">search titles only</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="hasImage"
            checked={hasImage}
            onChange={(e) => handleCheckboxChange('hasImage', e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="hasImage">has image</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="postedToday"
            checked={postedToday}
            onChange={(e) => handleCheckboxChange('postedToday', e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="postedToday">posted today</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="hideDuplicates"
            checked={hideDuplicates}
            onChange={(e) => handleCheckboxChange('hideDuplicates', e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="hideDuplicates">hide duplicates</label>
        </div>
      </div>
      
      {/* Seller type */}
      <div className="mb-5">
        <h3 className="font-bold mb-2">seller type</h3>
        <div className="flex gap-1">
          <button className="border border-gray-300 px-4 py-1 bg-gray-100">all</button>
          <button className="border border-gray-300 px-4 py-1">owner</button>
          <button className="border border-gray-300 px-4 py-1">dealer</button>
        </div>
      </div>
      
      {/* Buttons */}
      <div className="flex flex-col gap-2">
        <button 
          onClick={resetFilters}
          className="border border-gray-300 bg-gray-100 w-full py-2"
        >
          reset
        </button>
        <button 
          onClick={applyFilters}
          className="border border-gray-300 bg-gray-100 w-full py-2"
        >
          apply
        </button>
      </div>
    </div>
  );
};

export default Filters; 
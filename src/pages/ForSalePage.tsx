import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { GridIcon, ListIcon } from 'lucide-react';
import Filters from '@/components/Filters';
import ListingCard from '@/components/ListingCard';
import { listingsAPI } from '@/lib/api';

interface Listing {
  id: string;
  title: string;
  price: number;
  description: string;
  location: string;
  images: string[];
  user_id: string;
  created_at: string;
  category_id: string;
  status: string;
}

const ForSalePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [viewMode, setViewMode] = useState<'gallery' | 'list'>('gallery');
  
  // Parse current filters from URL
  const searchParams = new URLSearchParams(location.search);
  const viewModeFromUrl = searchParams.get('view') as 'gallery' | 'list' | null;
  
  // Initialize view mode from URL if available
  useEffect(() => {
    if (viewModeFromUrl && (viewModeFromUrl === 'gallery' || viewModeFromUrl === 'list')) {
      setViewMode(viewModeFromUrl);
    }
  }, [viewModeFromUrl]);
  
  // Load listings
  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      try {
        // Convert search params to object
        const params: Record<string, any> = {};
        searchParams.forEach((value, key) => {
          params[key] = value;
        });
        
        // Add category if not present
        if (!params.category) {
          params.category = 'for-sale';
        }
        
        const data = await listingsAPI.getListings(params);
        // Check if data has listings property, if not, handle as fallback data
        const listingsData = data?.listings || [];
        setListings(listingsData);
        setFilteredListings(listingsData);
      } catch (error) {
        console.error('Error fetching listings:', error);
        // Fallback listings are already handled in the API with empty arrays
        setListings([]);
        setFilteredListings([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchListings();
  }, [location.search]);
  
  // Handle filter changes
  const handleFilterChange = (filters: Record<string, any>) => {
    // This will be called by the Filters component
    // URL-based filtering is already handled in the useEffect above
    console.log('Filter changed:', filters);
  };
  
  // Change view mode
  const toggleViewMode = () => {
    const newMode = viewMode === 'gallery' ? 'list' : 'gallery';
    setViewMode(newMode);
    
    // Update URL to persist view mode
    const params = new URLSearchParams(location.search);
    params.set('view', newMode);
    navigate({
      pathname: location.pathname,
      search: params.toString()
    }, { replace: true });
  };
  
  // Sort listings
  const handleSortChange = (sortOption: string) => {
    const params = new URLSearchParams(location.search);
    params.set('sort', sortOption);
    navigate({
      pathname: location.pathname,
      search: params.toString()
    });
  };

  // Get current category name from URL
  const getCategoryName = () => {
    const pathParts = location.pathname.split('/');
    const categoryPath = pathParts[pathParts.length - 1];
    
    // Convert URL path to display name
    switch(categoryPath) {
      case 'for-sale': return 'For Sale';
      case 'housing': return 'Housing';
      case 'jobs': return 'Jobs';
      case 'services': return 'Services';
      case 'community': return 'Community';
      case 'gigs': return 'Gigs';
      default: 
        const subcategoryName = categoryPath.charAt(0).toUpperCase() + categoryPath.slice(1);
        return subcategoryName.replace(/-/g, ' ');
    }
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters sidebar */}
        <div className="w-full md:w-72 shrink-0">
          <Filters 
            category={location.pathname.split('/').pop() || 'for-sale'} 
            onFilterChange={handleFilterChange} 
          />
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">
                {getCategoryName()} {searchParams.get('q') ? `- "${searchParams.get('q')}"` : ''}
              </h1>
              <div className="flex items-center gap-2">
                <select 
                  className="px-2 py-1 border rounded-md"
                  value={searchParams.get('sort') || 'newest'}
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={toggleViewMode}
                >
                  {viewMode === 'gallery' ? <ListIcon size={16} /> : <GridIcon size={16} />}
                </Button>
              </div>
            </div>
            <p className="text-gray-500 mt-1">
              {filteredListings.length} results {isLoading ? '(loading...)' : ''}
            </p>
          </div>
          
          {/* Listings grid/list */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium">No listings found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <div className={
              viewMode === 'gallery'
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }>
              {filteredListings.map((listing) => (
                <ListingCard 
                  key={listing.id} 
                  listing={listing} 
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForSalePage; 
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';
import { MapPin } from 'lucide-react';

interface Listing {
  id: string;
  title: string;
  price: number;
  description: string;
  location: string;
  images?: string[];
  user_id?: string;
  created_at: string;
  category_id?: string;
  status?: string;
}

interface ListingCardProps {
  listing: Listing;
  viewMode?: 'gallery' | 'list';
}

const ListingCard: React.FC<ListingCardProps> = ({ 
  listing, 
  viewMode = 'gallery' 
}) => {
  // Create a fallback object with default values for missing properties
  const safeListingData = {
    id: listing.id || 'temp-id',
    title: listing.title || 'Untitled Listing',
    price: listing.price || 0,
    description: listing.description || 'No description available',
    location: listing.location || 'Location not specified',
    images: listing.images || [],
    created_at: listing.created_at || new Date().toISOString()
  };
  
  const { 
    id, 
    title, 
    price, 
    location, 
    images, 
    created_at 
  } = safeListingData;

  // Format the date
  const formattedDate = formatDistanceToNow(new Date(created_at), { addSuffix: true });
  
  // Get the first image or use placeholder
  const imageUrl = images && images.length > 0 
    ? images[0] 
    : 'https://placehold.co/400x300/gray/white?text=No+Image';

  // Format price
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(price);

  if (viewMode === 'list') {
    return (
      <Card className="overflow-hidden h-36 flex">
        <div className="w-40 h-full relative">
          <img 
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col flex-1 justify-between">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg line-clamp-1">{title}</h3>
                <div className="flex items-center mt-1 text-gray-500 text-sm">
                  <MapPin size={14} className="mr-1" />
                  <span>{location}</span>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none">
                {formattedPrice}
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="py-2 px-4 text-sm text-gray-500 border-t flex justify-between">
            <span>{formattedDate}</span>
          </CardFooter>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="w-full h-48 relative">
        <img 
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        <Badge className="absolute top-2 right-2 bg-green-100 text-green-800 hover:bg-green-100 border-none">
          {formattedPrice}
        </Badge>
      </div>
      <CardContent className="flex-1 p-4">
        <h3 className="font-medium text-lg mb-2 line-clamp-1">{title}</h3>
        <div className="flex items-center text-gray-500 text-sm">
          <MapPin size={14} className="mr-1" />
          <span>{location}</span>
        </div>
      </CardContent>
      <CardFooter className="py-2 px-4 text-sm text-gray-500 border-t">
        {formattedDate}
      </CardFooter>
    </Card>
  );
};

export default ListingCard;

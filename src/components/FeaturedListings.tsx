
import { listings } from "@/data/mockData";
import ListingCard from "./ListingCard";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const FeaturedListings = () => {
  // Filter listings to get only the featured ones
  const featuredListings = listings.filter(listing => listing.isFeatured);
  
  return (
    <section className="py-12 bg-gray-50">
      <div className="container">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Listings</h2>
          <Button variant="link" className="text-classify-purple flex items-center">
            View all <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredListings.map(listing => (
            <div key={listing.id} className="relative">
              <ListingCard listing={listing} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;

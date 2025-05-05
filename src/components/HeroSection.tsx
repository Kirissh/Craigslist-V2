
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* Background gradient */}
      <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-classify-purple to-classify-blue"></div>
      
      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Find exactly what you're looking for
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-md">
              Discover thousands of listings for jobs, housing, items for sale, services, and more in your local community.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button className="gradient-purple" size="lg">
                Post an Ad
              </Button>
              <Button variant="outline" size="lg">
                Browse Listings
              </Button>
            </div>
          </div>
          
          <div className="relative h-64 md:h-auto">
            <div className="absolute top-4 right-4 w-64 h-64 rounded-xl bg-white p-4 shadow-lg transform rotate-3">
              <div className="h-40 w-full bg-gray-200 rounded-md mb-2"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded-full mb-2"></div>
              <div className="h-3 w-1/2 bg-gray-200 rounded-full"></div>
            </div>
            <div className="absolute top-12 left-4 w-64 h-64 rounded-xl bg-white p-4 shadow-lg transform -rotate-6">
              <div className="h-40 w-full bg-gray-200 rounded-md mb-2"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded-full mb-2"></div>
              <div className="h-3 w-1/2 bg-gray-200 rounded-full"></div>
            </div>
            <div className="absolute top-24 right-16 w-64 h-64 rounded-xl bg-white p-4 shadow-lg">
              <div className="h-40 w-full bg-gray-200 rounded-md mb-2"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded-full mb-2"></div>
              <div className="h-3 w-1/2 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

import {
  Briefcase,
  Car,
  Home,
  ShoppingCart,
  Users,
  Wrench
} from "lucide-react";
import { categories } from "@/data/mockData";
import { Link } from "react-router-dom";

const CategoryGrid = () => {
  // Map of category IDs to the corresponding icon components
  const iconMap: Record<string, React.ReactNode> = {
    housing: <Home className="h-6 w-6" />,
    jobs: <Briefcase className="h-6 w-6" />,
    forsale: <ShoppingCart className="h-6 w-6" />,
    services: <Wrench className="h-6 w-6" />,
    community: <Users className="h-6 w-6" />,
    vehicles: <Car className="h-6 w-6" />
  };

  // Map category IDs to URL paths
  const categoryUrlMap: Record<string, string> = {
    housing: "housing",
    jobs: "jobs",
    forsale: "for-sale",
    services: "services",
    community: "community",
    vehicles: "for-sale/cars"
  };

  return (
    <section className="py-12">
      <div className="container">
        <h2 className="text-3xl font-bold mb-8">Browse by Category</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/browse/${categoryUrlMap[category.id] || 'for-sale'}`}
              className="flex flex-col items-center p-6 bg-white rounded-xl border hover:shadow-md transition-all text-center"
            >
              <div className="w-12 h-12 rounded-full bg-classify-purple-light/10 flex items-center justify-center mb-3 text-classify-purple">
                {iconMap[category.id]}
              </div>
              <h3 className="font-medium">{category.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{category.count} listings</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;

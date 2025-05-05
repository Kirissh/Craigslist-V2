import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const categories = [
    { name: "community", items: ["activities", "artists", "childcare", "classes", "events", "general", "groups", "local news", "lost+found", "missed connections", "musicians", "pets", "politics", "rideshare", "volunteers"] },
    { name: "services", items: ["automotive", "beauty", "cell/mobile", "computer", "creative", "cycle", "event", "financial", "health/well", "household", "labor/move", "legal", "lessons", "marine", "pet", "real estate", "skilled trade", "sm biz ads", "travel/vac", "write/ed/tran"] },
    { name: "housing", items: ["apts / housing", "housing swap", "housing wanted", "office / commercial", "parking / storage", "real estate for sale", "rooms / shared", "rooms wanted", "sublets / temporary", "vacation rentals"] },
    { name: "for sale", items: ["antiques", "appliances", "arts+crafts", "atv/utv/sno", "auto parts", "aviation", "baby+kids", "barter", "beauty+hlth", "bikes", "boats", "books", "business", "cars+trucks", "cds/dvd/vhs", "cell phones", "clothes+acc", "collectibles", "computer parts", "computers", "electronics", "farm+garden", "free stuff", "furniture", "garage sale", "general", "heavy equip", "household", "jewelry", "materials", "motorcycle parts", "motorcycles", "music instr", "photo+video", "rvs+camp", "sporting", "tickets", "tools", "toys+games", "trailers", "video gaming", "wanted", "wheels+tires"] },
    { name: "jobs", items: ["accounting+finance", "admin / office", "arch / engineering", "art / media / design", "biotech / science", "business / mgmt", "customer service", "education", "etc / misc", "food / bev / hosp", "general labor", "government", "human resources", "legal / paralegal", "manufacturing", "marketing / pr / ad", "medical / health", "nonprofit sector", "real estate", "retail / wholesale", "sales / biz dev", "salon / spa / fitness", "security", "skilled trade / craft", "software / qa / dba", "systems / network", "technical support", "transport", "tv / film / video", "web / info design", "writing / editing"] },
    { name: "gigs", items: ["computer", "creative", "crew", "domestic", "event", "labor", "talent", "writing"] }
  ];

  return (
    <div className="max-w-screen-xl mx-auto p-4 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main categories */}
        <div className="col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-lg font-semibold text-purple-700 mb-2">{category.name}</h2>
                <ul className="space-y-1">
                  {category.items.map((item, idx) => (
                    <li key={idx}>
                      <Link 
                        to={`/browse/${category.name === 'for sale' ? 'for-sale' : category.name}/${item.replace(/ /g, '-').replace(/\+/g, '-').replace(/\//g, '-')}`} 
                        className="text-blue-600 hover:underline text-sm"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-1">
          <div className="bg-gray-50 p-4 border border-gray-200 rounded mb-4">
            <h2 className="text-lg font-semibold mb-2">Welcome to craigslist</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/browse" className="text-blue-600 hover:underline">search craigslist</Link>
              </li>
              <li>
                <Link to="/post-ad" className="text-blue-600 hover:underline">post to classifieds</Link>
              </li>
              <li>
                <Link to="/forum" className="text-blue-600 hover:underline">discuss in forums</Link>
              </li>
              <li>
                <Link to="/profile" className="text-blue-600 hover:underline">my account</Link>
              </li>
              <li>
                <Link to="/messages" className="text-blue-600 hover:underline">my messages</Link>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 border border-gray-200 rounded mb-4">
            <h2 className="text-lg font-semibold mb-2">Event Calendar</h2>
            <p className="text-sm text-gray-600 mb-2">Discover events happening in your area</p>
            <Link to="/events" className="text-blue-600 hover:underline text-sm">Browse Events</Link>
          </div>

          <div className="bg-gray-50 p-4 border border-gray-200 rounded">
            <h2 className="text-lg font-semibold mb-2">Avoiding Scams & Fraud</h2>
            <ul className="space-y-1 text-sm">
              <li>
                <Link to="/safety" className="text-blue-600 hover:underline">Safety tips</Link>
              </li>
              <li>
                <Link to="/scams" className="text-blue-600 hover:underline">Common scams</Link>
              </li>
              <li>
                <Link to="/policies" className="text-blue-600 hover:underline">Prohibited items</Link>
              </li>
              <li>
                <Link to="/help" className="text-blue-600 hover:underline">Help & FAQ</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-gray-500">
        <div className="mb-2">
          <span>© 2023 craigslist clone</span> •
          <Link to="/terms" className="ml-2 text-blue-600 hover:underline">terms</Link> •
          <Link to="/privacy" className="ml-2 text-blue-600 hover:underline">privacy</Link> •
          <Link to="/safety" className="ml-2 text-blue-600 hover:underline">safety</Link> •
          <Link to="/about" className="ml-2 text-blue-600 hover:underline">about</Link> •
          <Link to="/contact" className="ml-2 text-blue-600 hover:underline">contact</Link>
        </div>
        <p>This is a demo project created for educational purposes.</p>
      </div>
    </div>
  );
};

export default Index;

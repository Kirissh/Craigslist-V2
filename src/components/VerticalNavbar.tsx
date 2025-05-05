
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Search,
  Users,
  MessageSquare,
  PlusCircle,
  Bell,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import AnimatedNavItem from "./AnimatedNavMenu";

const VerticalNavbar = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);

  const navItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Browse", icon: Search, path: "/browse" },
    { name: "Forum", icon: Users, path: "/forum" },
    { name: "Messages", icon: MessageSquare, path: "/messages" },
  ];

  const skipToContent = () => {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.tabIndex = -1;
      mainContent.focus();
    }
  };

  return (
    <>
      {/* Skip link for keyboard users */}
      <a href="#main-content" onClick={skipToContent} className="skip-link">
        Skip to content
      </a>
      
      <motion.aside
        className={cn(
          "h-screen fixed top-0 left-0 z-30 flex flex-col bg-white border-r border-gray-200",
          isExpanded ? "w-64" : "w-20"
        )}
        animate={{ width: isExpanded ? 256 : 80 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        initial={false}
      >
        {/* Top section with logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          {isExpanded ? (
            <Link to="/" className="flex items-center">
              <motion.span 
                className="text-2xl font-bold bg-clip-text text-transparent gradient-purple"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                Class
              </motion.span>
              <motion.span 
                className="text-2xl font-bold bg-clip-text text-transparent gradient-blue"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                ify
              </motion.span>
            </Link>
          ) : (
            <Link to="/" className="mx-auto">
              <motion.span 
                className="text-2xl font-bold bg-clip-text text-transparent gradient-purple"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                C
              </motion.span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isExpanded ? (
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            ) : (
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            )}
          </Button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto py-4" aria-label="Main Navigation">
          <ul className="space-y-2 px-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <AnimatedNavItem
                  href={item.path}
                  icon={item.icon}
                  label={item.name}
                  isActive={location.pathname === item.path}
                />
              </li>
            ))}
          </ul>
        </nav>

        {/* Post ad button */}
        <div className="p-4 border-t border-gray-200">
          <Button
            className="gradient-purple w-full flex items-center justify-center"
            asChild
          >
            <Link to="/post-ad">
              <PlusCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              {isExpanded && <span className="ml-2">Post Ad</span>}
            </Link>
          </Button>
        </div>

        {/* User section */}
        <div className="p-4 border-t border-gray-200">
          <Link
            to="/profile"
            className="flex items-center px-2 py-2 rounded-lg hover:bg-gray-100"
            aria-label="User Account"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            {isExpanded && (
              <motion.span 
                className="ml-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                User Account
              </motion.span>
            )}
          </Link>
        </div>
      </motion.aside>
    </>
  );
};

export default VerticalNavbar;

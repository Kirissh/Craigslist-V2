
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}

const AnimatedNavItem: React.FC<NavItemProps> = ({
  href,
  icon: Icon,
  label,
  isActive,
}) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center px-4 py-3 rounded-lg transition-colors relative",
        isActive
          ? "bg-classify-purple text-white font-medium"
          : "hover:bg-gray-100"
      )}
    >
      {isActive && (
        <motion.div
          className="absolute inset-0 bg-classify-purple rounded-lg z-0"
          layoutId="nav-highlight"
          initial={{ borderRadius: 8 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <Icon className="h-5 w-5 flex-shrink-0 z-10" />
      <span className="ml-3 z-10">{label}</span>
    </Link>
  );
};

export default AnimatedNavItem;

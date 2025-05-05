import React from "react";
import { useNavigate, useLocation, Navigate, useParams } from "react-router-dom";
import ForSalePage from './ForSalePage';

const Browse: React.FC = () => {
  const location = useLocation();
  const { category, subcategory } = useParams();
  const pathname = location.pathname;
  
  // Check if we're on the /browse page directly
  if (pathname === '/browse') {
    // If user just visits /browse, redirect to for-sale category
    return <Navigate to="/browse/for-sale" replace />;
  }
  
  // Extract the category from the URL if not provided as a param
  const currentCategory = category || pathname.split('/')[2];
  
  // Format URL params for the filters
  let queryParams = new URLSearchParams(location.search);
  if (subcategory && !queryParams.has('subcategory')) {
    queryParams.set('subcategory', subcategory);
  }
  
  // Validate category
  const validCategories = ['for-sale', 'housing', 'jobs', 'services', 'community', 'gigs', 'resumes', 'discussion'];
  if (!validCategories.includes(currentCategory)) {
    // If an unknown category, default to for-sale
    return <Navigate to="/browse/for-sale" replace />;
  }
  
  // All categories use the ForSalePage component with different props
  return <ForSalePage />;
};

export default Browse;

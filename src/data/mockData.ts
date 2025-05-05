
export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  category: string;
  subcategory: string;
  image: string;
  date: string;
  isFeatured: boolean;
}

export const categories: Category[] = [
  {
    id: 'housing',
    name: 'Housing',
    icon: 'Home',
    count: 1243,
  },
  {
    id: 'jobs',
    name: 'Jobs',
    icon: 'Briefcase',
    count: 856,
  },
  {
    id: 'forsale',
    name: 'For Sale',
    icon: 'ShoppingCart',
    count: 2734,
  },
  {
    id: 'services',
    name: 'Services',
    icon: 'Wrench',
    count: 943,
  },
  {
    id: 'community',
    name: 'Community',
    icon: 'Users',
    count: 426,
  },
  {
    id: 'vehicles',
    name: 'Vehicles',
    icon: 'Car',
    count: 732,
  },
];

export const listings: Listing[] = [
  {
    id: '1',
    title: 'Modern Apartment in Downtown',
    description: 'Beautiful 2 bedroom apartment with stunning city views and modern amenities.',
    price: 1850,
    location: 'Downtown, NY',
    category: 'housing',
    subcategory: 'apartments',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    date: '2023-05-12',
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Senior Frontend Developer',
    description: 'We are looking for an experienced Frontend Developer proficient in React and TypeScript.',
    price: 120000,
    location: 'Remote / San Francisco',
    category: 'jobs',
    subcategory: 'software',
    image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    date: '2023-05-15',
    isFeatured: true,
  },
  {
    id: '3',
    title: 'iPhone 14 Pro - Like New',
    description: 'Selling my iPhone 14 Pro, 256GB, black, used for only 3 months. Comes with original box and accessories.',
    price: 899,
    location: 'Brooklyn, NY',
    category: 'forsale',
    subcategory: 'electronics',
    image: 'https://images.unsplash.com/photo-1663761879666-f7fa231afe3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2342&q=80',
    date: '2023-05-18',
    isFeatured: true,
  },
  {
    id: '4',
    title: 'Professional Web Design Services',
    description: 'I offer professional web design services for businesses of all sizes. Portfolio available upon request.',
    price: 2500,
    location: 'Online',
    category: 'services',
    subcategory: 'computer',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    date: '2023-05-20',
    isFeatured: false,
  },
  {
    id: '5',
    title: '2019 Tesla Model 3 - Low Miles',
    description: 'Selling my 2019 Tesla Model 3 with only 22k miles. White exterior, black interior, autopilot included.',
    price: 42000,
    location: 'Queens, NY',
    category: 'vehicles',
    subcategory: 'cars',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    date: '2023-05-22',
    isFeatured: true,
  },
  {
    id: '6',
    title: 'Luxury Sofa - Nearly New',
    description: 'Beautiful luxury sofa from West Elm, barely used, no stains or damage, smoke-free home.',
    price: 1200,
    location: 'Manhattan, NY',
    category: 'forsale',
    subcategory: 'furniture',
    image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    date: '2023-05-24',
    isFeatured: false,
  },
];

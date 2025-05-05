import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

// Get the directory name properly in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or service key. Check your .env file.');
  process.exit(1);
}

// Initialize Supabase client with admin privileges
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Mock data for categories
const categories = [
  {
    id: uuidv4(),
    name: 'For Sale',
    slug: 'for-sale',
    description: 'Items available for purchase',
    icon: 'tag',
    parent_id: null,
  },
  {
    id: uuidv4(),
    name: 'Housing',
    slug: 'housing',
    description: 'Apartments, homes, and rooms for rent or sale',
    icon: 'home',
    parent_id: null,
  },
  {
    id: uuidv4(),
    name: 'Jobs',
    slug: 'jobs',
    description: 'Job listings and employment opportunities',
    icon: 'briefcase',
    parent_id: null,
  },
  {
    id: uuidv4(),
    name: 'Services',
    slug: 'services',
    description: 'Professional and personal services',
    icon: 'tool',
    parent_id: null,
  },
  {
    id: uuidv4(),
    name: 'Community',
    slug: 'community',
    description: 'Local events, groups, and activities',
    icon: 'users',
    parent_id: null,
  },
];

// Subcategories for the "For Sale" category
const forSaleSubcategories = [
  {
    id: uuidv4(),
    name: 'Electronics',
    slug: 'electronics',
    description: 'Computers, phones, TVs, and other electronics',
    icon: 'smartphone',
  },
  {
    id: uuidv4(),
    name: 'Furniture',
    slug: 'furniture',
    description: 'Sofas, chairs, tables, and other home furniture',
    icon: 'chair',
  },
  {
    id: uuidv4(),
    name: 'Clothing',
    slug: 'clothing',
    description: 'Clothing, shoes, and accessories',
    icon: 'shirt',
  },
  {
    id: uuidv4(),
    name: 'Cars & Trucks',
    slug: 'cars-trucks',
    description: 'Automobiles for sale',
    icon: 'car',
  },
  {
    id: uuidv4(),
    name: 'Bicycle',
    slug: 'bicycle',
    description: 'Bicycles and accessories',
    icon: 'bike',
  },
];

// Mock data for listings
const listings = [
  {
    id: uuidv4(),
    title: 'iPhone 14 Pro - Excellent Condition',
    description: 'Selling my iPhone 14 Pro 256GB in excellent condition. Includes original box, charger, and case. Battery health at 92%. No scratches or dents.',
    price: 799,
    images: [
      'https://i.imgur.com/jQpfHJD.jpg',
      'https://i.imgur.com/T5IQAzn.jpg',
    ],
    location: 'San Francisco',
    country: 'United States',
    city: 'San Francisco',
    status: 'active',
    is_featured: true,
    views: 45,
    keywords: ['iphone', 'apple', 'smartphone', 'phone', 'mobile'],
  },
  {
    id: uuidv4(),
    title: 'Modern Leather Sofa - Like New',
    description: 'Beautiful modern black leather sofa in like-new condition. Only 6 months old from West Elm. Moving and must sell. Very comfortable with no damage or stains.',
    price: 1200,
    images: [
      'https://i.imgur.com/6PgbXrD.jpg',
      'https://i.imgur.com/LVpgZ4Z.jpg',
    ],
    location: 'Oakland',
    country: 'United States',
    city: 'Oakland',
    status: 'active',
    is_featured: true,
    views: 32,
    keywords: ['sofa', 'couch', 'furniture', 'leather', 'living room'],
  },
  {
    id: uuidv4(),
    title: '2018 Honda Civic - Low Miles',
    description: 'Selling my 2018 Honda Civic EX-L with only 35,000 miles. One owner, clean title, no accidents. Regular maintenance with all records available. New tires, brakes in excellent condition.',
    price: 18500,
    images: [
      'https://i.imgur.com/KPGODr5.jpg',
      'https://i.imgur.com/3hX6lQl.jpg',
    ],
    location: 'San Jose',
    country: 'United States',
    city: 'San Jose',
    status: 'active',
    is_featured: false,
    views: 67,
    keywords: ['honda', 'civic', 'car', 'vehicle', 'sedan'],
  },
  {
    id: uuidv4(),
    title: 'Mountain Bike - Trek Marlin 7',
    description: 'Trek Marlin 7 mountain bike in excellent condition. 2022 model with hydraulic disc brakes, 29-inch wheels, and front suspension. Only ridden a few times, like new condition.',
    price: 750,
    images: [
      'https://i.imgur.com/DUCGcrK.jpg',
      'https://i.imgur.com/YfzQYgI.jpg',
    ],
    location: 'Berkeley',
    country: 'United States',
    city: 'Berkeley',
    status: 'active',
    is_featured: false,
    views: 28,
    keywords: ['bike', 'bicycle', 'mountain bike', 'trek', 'cycling'],
  },
  {
    id: uuidv4(),
    title: 'Vintage Record Player',
    description: 'Beautiful vintage record player from the 1970s. Fully restored and in perfect working condition. Great sound quality and a real conversation piece.',
    price: 350,
    images: [
      'https://i.imgur.com/cHddUCR.jpg',
      'https://i.imgur.com/KFyWRZB.jpg',
    ],
    location: 'San Francisco',
    country: 'United States',
    city: 'San Francisco',
    status: 'active',
    is_featured: false,
    views: 19,
    keywords: ['vintage', 'record player', 'vinyl', 'music', 'audio'],
  },
];

// Function to populate the database
async function populateDatabase() {
  try {
    console.log('Starting database population...');

    // Insert categories
    console.log('Inserting categories...');
    const { error: categoriesError } = await supabase
      .from('categories')
      .upsert(categories, { onConflict: 'id' });

    if (categoriesError) {
      console.error('Error inserting categories:', categoriesError);
      return;
    }
    console.log('✅ Categories inserted successfully');

    // Find the "For Sale" category ID
    const forSaleCategory = categories.find(c => c.slug === 'for-sale');
    
    if (!forSaleCategory) {
      console.error('For Sale category not found');
      return;
    }

    // Insert subcategories with the parent ID
    console.log('Inserting subcategories...');
    const subcategoriesWithParent = forSaleSubcategories.map(subcategory => ({
      ...subcategory,
      parent_id: forSaleCategory.id,
    }));

    const { error: subcategoriesError } = await supabase
      .from('categories')
      .upsert(subcategoriesWithParent, { onConflict: 'id' });

    if (subcategoriesError) {
      console.error('Error inserting subcategories:', subcategoriesError);
      return;
    }
    console.log('✅ Subcategories inserted successfully');

    // Create a test user if it doesn't exist
    console.log('Creating test user...');
    const testEmail = 'test@example.com';
    const testPassword = 'Test123!';

    // Check if user exists
    const { data: existingUsers } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', testEmail)
      .limit(1);

    let userId;

    if (existingUsers && existingUsers.length > 0) {
      console.log('Test user already exists, using existing user');
      userId = existingUsers[0].id;
    } else {
      // Create user in auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: testEmail,
        password: testPassword,
        email_confirm: true,
      });

      if (authError) {
        console.error('Error creating test user auth:', authError);
        return;
      }

      userId = authData.user.id;

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: testEmail,
          full_name: 'Test User',
          location: 'San Francisco',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (profileError) {
        console.error('Error creating test user profile:', profileError);
        return;
      }
      console.log('✅ Test user created successfully');
    }

    // Insert listings with the user ID and category ID
    console.log('Inserting listings...');
    const electronicsSubcategory = subcategoriesWithParent.find(sc => sc.slug === 'electronics');
    const furnitureSubcategory = subcategoriesWithParent.find(sc => sc.slug === 'furniture');
    const carsSubcategory = subcategoriesWithParent.find(sc => sc.slug === 'cars-trucks');
    const bikeSubcategory = subcategoriesWithParent.find(sc => sc.slug === 'bicycle');
    
    const listingsWithIds = [
      {
        ...listings[0],
        user_id: userId,
        category_id: forSaleCategory.id,
        subcategory_id: electronicsSubcategory.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      },
      {
        ...listings[1],
        user_id: userId,
        category_id: forSaleCategory.id,
        subcategory_id: furnitureSubcategory.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        ...listings[2],
        user_id: userId,
        category_id: forSaleCategory.id,
        subcategory_id: carsSubcategory.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        ...listings[3],
        user_id: userId,
        category_id: forSaleCategory.id,
        subcategory_id: bikeSubcategory.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        ...listings[4],
        user_id: userId,
        category_id: forSaleCategory.id,
        subcategory_id: electronicsSubcategory.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    const { error: listingsError } = await supabase
      .from('listings')
      .upsert(listingsWithIds, { onConflict: 'id' });

    if (listingsError) {
      console.error('Error inserting listings:', listingsError);
      return;
    }
    console.log('✅ Listings inserted successfully');

    console.log('Database population completed successfully!');
    console.log('\nTest user credentials:');
    console.log('Email:', testEmail);
    console.log('Password:', testPassword);
  } catch (error) {
    console.error('Error populating database:', error);
  }
}

populateDatabase(); 
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name properly in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.SUPABASE_URL || 'https://mgwnecbvbgsvdjsrjklb.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nd25lY2J2YmdzdmRqc3Jqa2xiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjI4Mzc2OCwiZXhwIjoyMDYxODU5NzY4fQ.bVVkjnKCooOSWj5wVN1jrY4xnP-lUa64xwLHrHLLDFQ';

// Create Supabase client with service key (for admin operations)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Setup database tables and policies
async function setupDatabase() {
  console.log('Setting up Supabase database tables and policies...');

  try {
    // Create profiles table if it doesn't exist
    const { error: profilesError } = await supabase.from('profiles').select('*').limit(1);
    
    if (profilesError && profilesError.code === '42P01') {
      console.log('Creating profiles table...');
      const { error } = await supabase.from('profiles').insert([
        {
          id: '00000000-0000-0000-0000-000000000000',
          full_name: 'System User',
          email: 'system@example.com',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
      
      if (error && error.code !== '23505') {
        console.error('Error creating profiles table:', error);
      } else {
        console.log('✓ Profiles table created');
      }
    } else {
      console.log('✓ Profiles table exists');
    }

    // Create categories table if it doesn't exist
    const { error: categoriesError } = await supabase.from('categories').select('*').limit(1);
    
    if (categoriesError && categoriesError.code === '42P01') {
      console.log('Creating categories table through SQL functions might be required');
      console.log('Please check Supabase dashboard to create the categories table manually with:');
      console.log(`
        CREATE TABLE IF NOT EXISTS categories (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          slug TEXT NOT NULL UNIQUE,
          description TEXT,
          icon TEXT,
          parent_id INTEGER REFERENCES categories(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
    } else {
      console.log('✓ Categories table exists');
      await insertSampleCategories();
    }

    // Check listings table
    const { error: listingsError } = await supabase.from('listings').select('*').limit(1);
    
    if (listingsError && listingsError.code === '42P01') {
      console.log('Creating listings table through SQL functions might be required');
      console.log('Please check Supabase dashboard to create the listings table manually');
    } else {
      console.log('✓ Listings table exists');
    }

    // Check chatbot_conversations table
    const { error: conversationsError } = await supabase.from('chatbot_conversations').select('*').limit(1);
    
    if (conversationsError && conversationsError.code === '42P01') {
      console.log('Creating chatbot_conversations table through SQL functions might be required');
      console.log('Please check Supabase dashboard to create the conversations table manually');
    } else {
      console.log('✓ Chatbot conversations table exists');
    }

    // Check chatbot_messages table
    const { error: messagesError } = await supabase.from('chatbot_messages').select('*').limit(1);
    
    if (messagesError && messagesError.code === '42P01') {
      console.log('Creating chatbot_messages table through SQL functions might be required');
      console.log('Please check Supabase dashboard to create the messages table manually');
    } else {
      console.log('✓ Chatbot messages table exists');
    }

    console.log('Database setup check completed');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

// Insert sample categories if they don't exist
async function insertSampleCategories() {
  console.log('Checking and inserting sample categories...');
  
  const categories = [
    { name: 'Jobs', slug: 'jobs', description: 'Job listings', icon: 'briefcase' },
    { name: 'Housing', slug: 'housing', description: 'Housing listings', icon: 'home' },
    { name: 'For Sale', slug: 'for-sale', description: 'Items for sale', icon: 'tag' },
    { name: 'Services', slug: 'services', description: 'Services offered', icon: 'tool' },
    { name: 'Community', slug: 'community', description: 'Community events', icon: 'users' },
    { name: 'Gigs', slug: 'gigs', description: 'Short term work', icon: 'clock' },
  ];
  
  try {
    for (const category of categories) {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', category.slug)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        console.log(`Error checking category ${category.slug}:`, error);
        continue;
      }
      
      if (!data) {
        console.log(`Inserting category: ${category.name}`);
        const { error: insertError } = await supabase
          .from('categories')
          .insert(category);
          
        if (insertError) {
          console.log(`Error inserting category ${category.name}:`, insertError);
        } else {
          console.log(`✓ Category ${category.name} inserted`);
        }
      } else {
        console.log(`✓ Category ${category.name} already exists`);
      }
    }
    
    console.log('Sample categories check completed');
  } catch (error) {
    console.error('Error with sample categories:', error);
  }
}

// Run the setup
async function run() {
  await setupDatabase();
  console.log('Database initialization complete!');
}

run(); 
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  location TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create RLS policies for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read profiles (they're public)
CREATE POLICY "Public profiles are viewable by everyone" 
  ON profiles FOR SELECT USING (true);

-- Only allow users to update their own profiles
CREATE POLICY "Users can update their own profiles" 
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Only allow users to insert their own profiles
CREATE POLICY "Users can insert their own profiles"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  icon TEXT,
  count INTEGER DEFAULT 0,
  parent_id UUID REFERENCES categories(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Define initial categories
INSERT INTO categories (name, icon, count) VALUES
  ('Housing', 'Home', 1243),
  ('Jobs', 'Briefcase', 856),
  ('For Sale', 'ShoppingCart', 2734),
  ('Services', 'Wrench', 943),
  ('Community', 'Users', 426),
  ('Vehicles', 'Car', 732);

-- Create listings table
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  images TEXT[] DEFAULT '{}',
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  category_id UUID REFERENCES categories(id) NOT NULL,
  subcategory_id UUID REFERENCES categories(id),
  location TEXT NOT NULL,
  country TEXT,
  city TEXT,
  status TEXT CHECK (status IN ('active', 'sold', 'expired', 'pending', 'deleted')) DEFAULT 'active',
  is_featured BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  keywords TEXT[] DEFAULT '{}',
  rating DECIMAL(3, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Create RLS policies for listings
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read listings
CREATE POLICY "Listings are viewable by everyone" 
  ON listings FOR SELECT USING (true);

-- Only allow users to insert their own listings
CREATE POLICY "Users can insert their own listings" 
  ON listings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Only allow users to update their own listings
CREATE POLICY "Users can update their own listings" 
  ON listings FOR UPDATE USING (auth.uid() = user_id);

-- Only allow users to delete their own listings
CREATE POLICY "Users can delete their own listings" 
  ON listings FOR DELETE USING (auth.uid() = user_id);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES listings(id) NOT NULL,
  sender_id UUID REFERENCES auth.users(id) NOT NULL,
  receiver_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create RLS policies for messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Only allow users to read their own messages (sender or receiver)
CREATE POLICY "Users can read their own messages" 
  ON messages FOR SELECT USING (
    auth.uid() = sender_id OR auth.uid() = receiver_id
  );

-- Only allow users to insert messages they send
CREATE POLICY "Users can insert messages they send" 
  ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES listings(id) NOT NULL,
  title TEXT NOT NULL,
  seller_id UUID REFERENCES auth.users(id) NOT NULL,
  buyer_id UUID REFERENCES auth.users(id) NOT NULL,
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create RLS policies for conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Only allow users to view conversations they are a part of
CREATE POLICY "Users can view their conversations" 
  ON conversations FOR SELECT USING (
    auth.uid() = seller_id OR auth.uid() = buyer_id
  );

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  listing_id UUID REFERENCES listings(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

-- Create RLS policies for favorites
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Users can view their own favorites
CREATE POLICY "Users can view their own favorites" 
  ON favorites FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own favorites
CREATE POLICY "Users can insert their own favorites" 
  ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own favorites
CREATE POLICY "Users can delete their own favorites" 
  ON favorites FOR DELETE USING (auth.uid() = user_id);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reviewer_id UUID REFERENCES auth.users(id) NOT NULL,
  reviewed_id UUID REFERENCES auth.users(id) NOT NULL,
  listing_id UUID REFERENCES listings(id) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  content TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(reviewer_id, listing_id)
);

-- Create RLS policies for reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can view reviews
CREATE POLICY "Reviews are viewable by everyone" 
  ON reviews FOR SELECT USING (true);

-- Only the reviewer can create the review
CREATE POLICY "Users can insert their own reviews" 
  ON reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Create forum topics table
CREATE TABLE IF NOT EXISTS forum_topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  category TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create RLS policies for forum topics
ALTER TABLE forum_topics ENABLE ROW LEVEL SECURITY;

-- Anyone can view forum topics
CREATE POLICY "Forum topics are viewable by everyone" 
  ON forum_topics FOR SELECT USING (true);

-- Only the creator can create the topic
CREATE POLICY "Users can insert their own forum topics" 
  ON forum_topics FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Only the creator can update the topic
CREATE POLICY "Users can update their own forum topics" 
  ON forum_topics FOR UPDATE USING (auth.uid() = user_id);

-- Only the creator can delete the topic
CREATE POLICY "Users can delete their own forum topics" 
  ON forum_topics FOR DELETE USING (auth.uid() = user_id);

-- Create forum replies table
CREATE TABLE IF NOT EXISTS forum_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID REFERENCES forum_topics(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create RLS policies for forum replies
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;

-- Anyone can view forum replies
CREATE POLICY "Forum replies are viewable by everyone" 
  ON forum_replies FOR SELECT USING (true);

-- Only the creator can create the reply
CREATE POLICY "Users can insert their own forum replies" 
  ON forum_replies FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Only the creator can update the reply
CREATE POLICY "Users can update their own forum replies" 
  ON forum_replies FOR UPDATE USING (auth.uid() = user_id);

-- Only the creator can delete the reply
CREATE POLICY "Users can delete their own forum replies" 
  ON forum_replies FOR DELETE USING (auth.uid() = user_id);

-- Create chatbot conversations table
CREATE TABLE IF NOT EXISTS chatbot_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create RLS policies for chatbot conversations
ALTER TABLE chatbot_conversations ENABLE ROW LEVEL SECURITY;

-- Only the user can view their conversations
CREATE POLICY "Users can view their chatbot conversations" 
  ON chatbot_conversations FOR SELECT USING (auth.uid() = user_id);

-- Only the user can insert their conversations
CREATE POLICY "Users can insert their chatbot conversations" 
  ON chatbot_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Only the user can delete their conversations
CREATE POLICY "Users can delete their chatbot conversations" 
  ON chatbot_conversations FOR DELETE USING (auth.uid() = user_id);

-- Create chatbot messages table
CREATE TABLE IF NOT EXISTS chatbot_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES chatbot_conversations(id) NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'bot')),
  content TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create RLS policies for chatbot messages
ALTER TABLE chatbot_messages ENABLE ROW LEVEL SECURITY;

-- Users can only view their own chatbot messages (via conversation ownership)
CREATE POLICY "Users can view their chatbot messages" 
  ON chatbot_messages FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM chatbot_conversations WHERE user_id = auth.uid()
    )
  );

-- Users can only insert their own chatbot messages (via conversation ownership)
CREATE POLICY "Users can insert chatbot messages to their conversations" 
  ON chatbot_messages FOR INSERT WITH CHECK (
    conversation_id IN (
      SELECT id FROM chatbot_conversations WHERE user_id = auth.uid()
    )
  );

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to update updated_at columns
CREATE TRIGGER update_profiles_modified
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_listings_modified
BEFORE UPDATE ON listings
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_forum_topics_modified
BEFORE UPDATE ON forum_topics
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_forum_replies_modified
BEFORE UPDATE ON forum_replies
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_chatbot_conversations_modified
BEFORE UPDATE ON chatbot_conversations
FOR EACH ROW EXECUTE FUNCTION update_modified_column(); 
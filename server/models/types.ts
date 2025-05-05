// User profile model
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  location?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

// Category model
export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
  parent_id?: string;
}

// Listing/Ad model
export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  user_id: string;
  category_id: string;
  subcategory_id?: string;
  location: string;
  country?: string;
  city?: string;
  status: 'active' | 'sold' | 'expired' | 'pending' | 'deleted';
  is_featured: boolean;
  views: number;
  created_at: string;
  updated_at: string;
  expires_at?: string;
  keywords?: string[];
  rating?: number;
}

// Message model
export interface Message {
  id: string;
  listing_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

// Chat conversation model
export interface Conversation {
  id: string;
  listing_id: string;
  title: string;
  seller_id: string;
  buyer_id: string;
  last_message_at: string;
  created_at: string;
}

// Saved/Favorite listing model
export interface Favorite {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
}

// Review model
export interface Review {
  id: string;
  reviewer_id: string;
  reviewed_id: string;
  listing_id: string;
  rating: number;
  content: string;
  created_at: string;
}

// Forum topic model
export interface ForumTopic {
  id: string;
  title: string;
  content: string;
  user_id: string;
  category: string;
  views: number;
  created_at: string;
  updated_at: string;
}

// Forum reply model
export interface ForumReply {
  id: string;
  topic_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// Chatbot conversation model
export interface ChatbotConversation {
  id: string;
  user_id: string;
  messages: ChatbotMessage[];
  created_at: string;
  updated_at: string;
}

// Chatbot message model
export interface ChatbotMessage {
  role: 'user' | 'bot';
  content: string;
  timestamp: string;
} 
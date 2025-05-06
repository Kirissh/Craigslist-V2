import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (client-side)
export const supabaseUrl = 'SUPABASE URL HERE';
export const supabaseAnonKey = 'ANON KEY HERE';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// API URL - handle both development and production
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.classifyapp.com/api' 
  : 'http://localhost:3001/api';

// Helper function to handle fetch requests
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  try {
    const { data } = await supabase.auth.getSession();
    const authHeader = data?.session 
      ? { Authorization: `Bearer ${data.session.access_token}` }
      : {};

    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
        ...options.headers,
      },
      ...options,
    });

    // Handle different types of errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: `Server error ${response.status}` }));
      throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// Auth API
export const authAPI = {
  // Sign up new user
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },
  
  // Sign in
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },
  
  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  },
  
  // Get current session
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data;
  },
  
  // Get user
  getUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },
  
  // Update user
  updateUser: async (updates: any) => {
    const { data, error } = await supabase.auth.updateUser(updates);
    if (error) throw error;
    return data;
  },
  
  // Send password reset email
  sendPasswordResetEmail: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return data;
  },
  
  // Reset password with token
  resetPassword: async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password,
    });
    if (error) throw error;
    return data;
  },
  
  // Get profile
  getProfile: async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userData.user?.id)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  // Update profile
  updateProfile: async (profileData: any) => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    const { error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userData.user?.id);
      
    if (error) throw error;
    
    return { message: 'Profile updated successfully' };
  },
};

// Listings API
export const listingsAPI = {
  // Get all listings with optional filters
  getListings: (params: Record<string, any> = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchAPI(`/listings?${queryString}`).catch(error => {
      console.error('Failed to fetch listings:', error);
      // Return fallback data with some realistic sample listings
      return { 
        listings: [
          {
            id: '1',
            title: 'iPhone 14 Pro - Like New',
            price: 899,
            description: 'Barely used iPhone 14 Pro, comes with original box and accessories.',
            location: 'Brooklyn, NY',
            images: ['https://placehold.co/600x400/png'],
            user_id: 'user1',
            created_at: new Date().toISOString(),
            category_id: 'electronics',
            status: 'active'
          },
          {
            id: '2',
            title: 'Modern Apartment in Downtown',
            price: 1850,
            description: 'Beautiful apartment in downtown area, close to all amenities.',
            location: 'Downtown, NY',
            images: ['https://placehold.co/600x400/png'],
            user_id: 'user2',
            created_at: new Date().toISOString(),
            category_id: 'housing',
            status: 'active'
          },
          {
            id: '3',
            title: 'Senior Frontend Developer',
            price: 120000,
            description: 'Looking for an experienced frontend developer with React skills.',
            location: 'San Francisco',
            images: [],
            user_id: 'user3',
            created_at: new Date().toISOString(),
            category_id: 'jobs',
            status: 'active'
          },
          {
            id: '4',
            title: 'Professional Web Design Services',
            price: 2500,
            description: 'Professional web design services for businesses and individuals.',
            location: 'Online',
            images: ['https://placehold.co/600x400/png'],
            user_id: 'user4',
            created_at: new Date().toISOString(),
            category_id: 'services',
            status: 'active'
          },
          {
            id: '5',
            title: '2019 Tesla Model 3 - Low Miles',
            price: 42000,
            description: 'Tesla Model 3 in excellent condition with low mileage.',
            location: 'Queens, NY',
            images: ['https://placehold.co/600x400/png'],
            user_id: 'user5',
            created_at: new Date().toISOString(),
            category_id: 'cars',
            status: 'active'
          },
          {
            id: '6',
            title: 'Luxury Sofa - Nearly New',
            price: 1200,
            description: 'Luxury sofa in excellent condition, barely used.',
            location: 'Manhattan, NY',
            images: ['https://placehold.co/600x400/png'],
            user_id: 'user6',
            created_at: new Date().toISOString(),
            category_id: 'furniture',
            status: 'active'
          }
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 6,
          pages: 1,
        }
      };
    });
  },

  // Get single listing
  getListingById: (id: string) => {
    return fetchAPI(`/listings/${id}`).catch(error => {
      console.error(`Failed to fetch listing ${id}:`, error);
      return null;
    });
  },

  // Get featured listings
  getFeaturedListings: () => {
    return fetchAPI('/listings/featured').catch(error => {
      console.error('Failed to fetch featured listings:', error);
      return [];
    });
  },

  // Get user listings
  getUserListings: (userId: string, status?: string) => {
    const queryString = status ? `?status=${status}` : '';
    return fetchAPI(`/listings/user/${userId}${queryString}`).catch(error => {
      console.error('Failed to fetch user listings:', error);
      return [];
    });
  },

  // Create listing
  createListing: (listingData: any) => {
    return fetchAPI('/listings', {
      method: 'POST',
      body: JSON.stringify(listingData),
    });
  },

  // Update listing
  updateListing: (id: string, listingData: any) => {
    return fetchAPI(`/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(listingData),
    });
  },

  // Delete listing
  deleteListing: (id: string) => {
    return fetchAPI(`/listings/${id}`, {
      method: 'DELETE',
    });
  },

  // Generate ad content with AI
  generateAdContent: (title: string, description?: string, category?: string) => {
    return fetchAPI('/listings/generate-content', {
      method: 'POST',
      body: JSON.stringify({ title, description, category }),
    }).catch(error => {
      console.error('Error generating content:', error);
      return {
        title: title,
        description: description || 'Failed to generate description. Please try again or write your own.',
        keywords: []
      };
    });
  },
};

// Chatbot API
export const chatbotAPI = {
  // Create new conversation
  createConversation: () => {
    return fetchAPI('/chatbot/conversations', {
      method: 'POST',
    }).catch(error => {
      console.error('Error creating conversation:', error);
      // Return a mock conversation ID if server fails
      return { id: 'mock-conversation-id-' + Date.now() };
    });
  },

  // Get user conversations
  getUserConversations: () => {
    return fetchAPI('/chatbot/conversations').catch(error => {
      console.error('Error getting conversations:', error);
      return [];
    });
  },

  // Get conversation messages
  getConversationMessages: (conversationId: string) => {
    // Handle mock conversation IDs for error cases
    if (conversationId.startsWith('mock-conversation-id-')) {
      return Promise.resolve([]);
    }
    return fetchAPI(`/chatbot/conversations/${conversationId}/messages`).catch(error => {
      console.error('Error getting messages:', error);
      return [];
    });
  },

  // Send message
  sendMessage: async (conversationId: string, message: string) => {
    // Handle mock conversation IDs for error cases
    if (conversationId.startsWith('mock-conversation-id-')) {
      // Return a mock response
      return {
        userMessage: {
          id: 'mock-user-msg-' + Date.now(),
          content: message,
          role: 'user',
          timestamp: new Date().toISOString()
        },
        botResponse: {
          id: 'mock-bot-msg-' + Date.now(),
          content: "I'm having trouble connecting to my AI brain at the moment. Please try again later.",
          role: 'bot',
          timestamp: new Date().toISOString()
        }
      };
    }
    
    try {
      return await fetchAPI('/chatbot/messages', {
        method: 'POST',
        body: JSON.stringify({ conversationId, message }),
      });
    } catch (error) {
      console.error('Error sending message:', error);
      // Return a mock response on error
      return {
        userMessage: {
          id: 'mock-user-msg-' + Date.now(),
          content: message,
          role: 'user',
          timestamp: new Date().toISOString()
        },
        botResponse: {
          id: 'mock-bot-msg-' + Date.now(),
          content: "I'm having trouble connecting to my AI brain at the moment. Please try again later.",
          role: 'bot',
          timestamp: new Date().toISOString()
        }
      };
    }
  },

  // Delete conversation
  deleteConversation: (conversationId: string) => {
    // Handle mock conversation IDs for error cases
    if (conversationId.startsWith('mock-conversation-id-')) {
      return Promise.resolve({ success: true });
    }
    return fetchAPI(`/chatbot/conversations/${conversationId}`, {
      method: 'DELETE',
    }).catch(error => {
      console.error('Error deleting conversation:', error);
      return { success: false, error: error.message };
    });
  },
}; 

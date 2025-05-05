import { createClient } from '@supabase/supabase-js';
import config from '../config/config.js';

const supabaseUrl = config.supabase.url;
const supabaseAnonKey = config.supabase.anonKey;
const supabaseServiceKey = config.supabase.serviceKey;

// Client with anonymous key - use for client-side operations
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Client with service role key - use for admin operations (server-side only)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export default {
  supabaseClient,
  supabaseAdmin
}; 
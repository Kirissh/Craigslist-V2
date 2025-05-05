import { createClient } from '@supabase/supabase-js';
import config from '../config/config';

// Initialize Supabase client
export const supabase = createClient(
  config.supabase.url,
  config.supabase.serviceKey
);

export default supabase; 
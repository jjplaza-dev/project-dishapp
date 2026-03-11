import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Manually load the .env file
dotenv.config();

// Check for both VITE_ and standard versions
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Helpful log to see what Node actually sees
  console.error("Current ENV:", process.env.NODE_ENV);
  throw new Error('Missing Supabase environment variables. Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
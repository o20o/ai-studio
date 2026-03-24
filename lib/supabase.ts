import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Generation {
  id: string;
  user_id: string | null;
  type: 'text' | 'image' | 'video';
  prompt: string;
  model: string;
  result_data: any;
  options: any;
  status: 'success' | 'failed';
  error_message?: string;
  created_at: string;
  updated_at: string;
}

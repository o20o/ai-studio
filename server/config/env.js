import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  GOOGLE_PROJECT_ID: z.string().min(1, 'GOOGLE_PROJECT_ID is required'),
  GOOGLE_LOCATION: z.string().default('us-central1'),
  GOOGLE_API_KEY: z.string().min(1, 'GOOGLE_API_KEY is required'),
  PORT: z.string().default('3001'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_SUPABASE_URL: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_URL is required'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required')
});

let config;

try {
  config = envSchema.parse(process.env);
} catch (error) {
  console.error('Environment validation failed:', error.errors);
  process.exit(1);
}

export default config;

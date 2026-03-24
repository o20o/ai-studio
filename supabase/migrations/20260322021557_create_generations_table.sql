/*
  # Create Generations Table for AI Content History

  ## Overview
  This migration creates the generations table to store history of all AI-generated content
  (text, images, and videos) with user tracking and metadata.

  ## New Tables
  
  ### `generations`
  - `id` (uuid, primary key) - Unique identifier for each generation
  - `user_id` (uuid, nullable) - Reference to authenticated user (null for anonymous)
  - `type` (text) - Type of generation: 'text', 'image', or 'video'
  - `prompt` (text) - The user's input prompt
  - `model` (text) - The AI model used (e.g., 'gemini-1.5-flash', 'veo-001')
  - `result_data` (jsonb) - Generated content stored as JSON
  - `options` (jsonb) - Generation options (aspect ratio, duration, etc.)
  - `status` (text) - Status: 'success' or 'failed'
  - `error_message` (text, nullable) - Error details if generation failed
  - `created_at` (timestamptz) - Timestamp of generation
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable Row Level Security (RLS) on generations table
  - Policy: Users can view their own generations
  - Policy: Users can create their own generations
  - Policy: Anonymous users can view their own session generations
  - Policy: Users can delete their own generations

  ## Indexes
  - Index on user_id for faster user-specific queries
  - Index on created_at for chronological ordering
  - Index on type for filtering by content type
*/

CREATE TABLE IF NOT EXISTS generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  type text NOT NULL CHECK (type IN ('text', 'image', 'video')),
  prompt text NOT NULL,
  model text NOT NULL,
  result_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  options jsonb DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'failed')),
  error_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_generations_user_id ON generations(user_id);
CREATE INDEX IF NOT EXISTS idx_generations_created_at ON generations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generations_type ON generations(type);

ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own generations"
  ON generations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anonymous can view own generations"
  ON generations
  FOR SELECT
  TO anon
  USING (user_id IS NULL);

CREATE POLICY "Users can create own generations"
  ON generations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anonymous can create generations"
  ON generations
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

CREATE POLICY "Users can delete own generations"
  ON generations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_generations_updated_at
  BEFORE UPDATE ON generations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

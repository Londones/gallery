-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  PRIMARY KEY (id),
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30),
  CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_-]+$')
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Add user_id column to artworks table
ALTER TABLE public.artworks ADD COLUMN user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Make user_id not nullable for new artworks (existing ones will be null temporarily)
-- We'll handle existing data separately if needed

-- Update artworks table to include user association
-- For now, we'll allow nullable user_id to handle existing data

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substring(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'User')
  );
  RETURN NEW;
END;
$$;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update RLS policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Update RLS policies for artworks to be user-specific
DROP POLICY IF EXISTS "Public can view artworks" ON public.artworks;
DROP POLICY IF EXISTS "Authenticated users can create artworks" ON public.artworks;
DROP POLICY IF EXISTS "Authenticated users can update artworks" ON public.artworks;
DROP POLICY IF EXISTS "Authenticated users can delete artworks" ON public.artworks;

-- New user-specific policies for artworks
CREATE POLICY "Anyone can view artworks"
  ON public.artworks
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own artworks"
  ON public.artworks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own artworks"
  ON public.artworks
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own artworks"
  ON public.artworks
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_artworks_user_id ON public.artworks(user_id);
CREATE INDEX idx_profiles_username ON public.profiles(username);

-- Add constraint to ensure usernames are URL-safe
ALTER TABLE public.profiles ADD CONSTRAINT username_url_safe 
  CHECK (username ~ '^[a-zA-Z0-9][a-zA-Z0-9_-]*[a-zA-Z0-9]$' OR char_length(username) = 1);
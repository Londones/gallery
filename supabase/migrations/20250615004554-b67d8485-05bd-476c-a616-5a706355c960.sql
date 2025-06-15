
-- Create artworks table to replace localStorage storage
CREATE TABLE public.artworks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  platform_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage bucket for artwork images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('artworks', 'artworks', true);

-- Create storage policy to allow public access to artwork images
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'artworks');

-- Create storage policy to allow uploads to artwork images
CREATE POLICY "Allow uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'artworks');

-- Create storage policy to allow updates to artwork images  
CREATE POLICY "Allow updates" ON storage.objects
FOR UPDATE USING (bucket_id = 'artworks');

-- Create storage policy to allow deletes of artwork images
CREATE POLICY "Allow deletes" ON storage.objects
FOR DELETE USING (bucket_id = 'artworks');

-- Enable RLS on artworks table (we'll make it publicly readable since it's a gallery)
ALTER TABLE public.artworks ENABLE ROW LEVEL SECURITY;

-- Allow public read access to artworks (for gallery display)
CREATE POLICY "Public can view artworks" ON public.artworks
FOR SELECT USING (true);

-- Allow inserts/updates/deletes (we'll handle admin auth in the app layer)
CREATE POLICY "Allow artwork management" ON public.artworks
FOR ALL USING (true);

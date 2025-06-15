
-- First, drop the overly permissive policies
DROP POLICY IF EXISTS "Allow artwork management" ON public.artworks;

-- Create secure policies that only allow authenticated users to manage artworks
-- Only authenticated users can insert artworks
CREATE POLICY "Authenticated users can create artworks" ON public.artworks
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Only authenticated users can update artworks
CREATE POLICY "Authenticated users can update artworks" ON public.artworks
FOR UPDATE 
TO authenticated
USING (true);

-- Only authenticated users can delete artworks
CREATE POLICY "Authenticated users can delete artworks" ON public.artworks
FOR DELETE 
TO authenticated
USING (true);

-- Secure the storage bucket - remove overly permissive policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Allow uploads" ON storage.objects;  
DROP POLICY IF EXISTS "Allow updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow deletes" ON storage.objects;

-- Create secure storage policies
-- Public can view artwork images
CREATE POLICY "Public can view artwork images" ON storage.objects
FOR SELECT 
USING (bucket_id = 'artworks');

-- Only authenticated users can upload to artworks bucket
CREATE POLICY "Authenticated users can upload artworks" ON storage.objects
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'artworks' AND auth.uid() IS NOT NULL);

-- Only authenticated users can update their uploads
CREATE POLICY "Authenticated users can update artworks" ON storage.objects
FOR UPDATE 
TO authenticated
USING (bucket_id = 'artworks' AND auth.uid() IS NOT NULL);

-- Only authenticated users can delete from artworks bucket
CREATE POLICY "Authenticated users can delete artworks" ON storage.objects
FOR DELETE 
TO authenticated
USING (bucket_id = 'artworks' AND auth.uid() IS NOT NULL);

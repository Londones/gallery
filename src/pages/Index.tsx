
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import ImagePreview from '@/components/ImagePreview';
import SearchButton from '@/components/SearchButton';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import ArtworkGrid from '@/components/ArtworkGrid';

interface Artwork {
  id: string;
  title: string;
  description: string;
  image_url: string;
  platform_link?: string;
  created_at: string;
}

const Index = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchArtworks();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredArtworks(artworks);
    } else {
      const filtered = artworks.filter(artwork => 
        artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artwork.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredArtworks(filtered);
    }
  }, [searchQuery, artworks]);

  const fetchArtworks = async () => {
    try {
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching artworks:', error);
        return;
      }

      setArtworks(data || []);
      setFilteredArtworks(data || []);
    } catch (error) {
      console.error('Error fetching artworks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleArtworkClick = (artworkId: string) => {
    navigate(`/artwork/${artworkId}`);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <motion.div 
      className="min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Main Content */}
      <main className="w-full px-4 py-8 text-center">
        {filteredArtworks.length === 0 ? (
          <EmptyState searchQuery={searchQuery} />
        ) : (
          <ArtworkGrid 
            artworks={filteredArtworks}
            onArtworkClick={handleArtworkClick}
          />
        )}
      </main>

      <SearchButton 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <ImagePreview
        src={previewImage?.src || ''}
        alt={previewImage?.alt || ''}
        isOpen={!!previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </motion.div>
  );
};

export default Index;

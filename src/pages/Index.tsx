
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import ArtworkGrid from '@/components/ArtworkGrid';
import EmptyState from '@/components/EmptyState';
import SearchButton from '@/components/SearchButton';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Gallery';
  }, []);

  useEffect(() => {
    fetchArtworks();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = artworks.filter(artwork =>
        artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artwork.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredArtworks(filtered);
    } else {
      setFilteredArtworks(artworks);
    }
  }, [artworks, searchQuery]);

  const fetchArtworks = async () => {
    try {
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArtworks(data || []);
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center py-16">
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 to-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {filteredArtworks.length === 0 ? (
          <EmptyState searchQuery={searchQuery} />
        ) : (
          <ArtworkGrid 
            artworks={filteredArtworks} 
            onArtworkClick={handleArtworkClick}
          />
        )}
      </main>

      {/* Floating Search Button */}
      <SearchButton 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    </motion.div>
  );
};

export default Index;

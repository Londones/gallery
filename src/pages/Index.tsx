import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import ImagePreview from '@/components/ImagePreview';
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  if (isLoading) {
    return (
      <motion.div 
        className="min-h-screen bg-white flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-gray-500">Loading artworks...</p>
        </motion.div>
      </motion.div>
    );
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
        {filteredArtworks.length === 0 && searchQuery ? (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-gray-500">No artworks found matching "{searchQuery}".</p>
          </motion.div>
        ) : filteredArtworks.length === 0 ? (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-gray-500">No artworks found.</p>
          </motion.div>
        ) : (
          <motion.div 
            className="masonry-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredArtworks.map((artwork) => (
              <motion.div 
                key={artwork.id}
                className="masonry-item group relative cursor-pointer mb-4 break-inside-avoid"
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleArtworkClick(artwork.id)}
                layoutId={`artwork-${artwork.id}`}
              >
                <motion.img
                  src={artwork.image_url}
                  alt={artwork.title}
                  className="w-full rounded-lg transition-all duration-300"
                  layoutId={`artwork-image-${artwork.id}`}
                  onError={(e) => {
                    console.error('Image failed to load:', artwork.image_url);
                    console.error('Error:', e);
                  }}
                  onLoad={() => console.log('Image loaded successfully:', artwork.image_url)}
                />
                <motion.div 
                  className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  <div className="text-center text-white p-6 max-w-full">
                    <h3 className="text-xl font-medium mb-2 text-white">
                      {artwork.title}
                    </h3>
                    <p className="text-sm text-white/90 leading-relaxed">
                      {artwork.description}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
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

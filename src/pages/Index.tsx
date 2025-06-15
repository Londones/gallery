
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import ImagePreview from '@/components/ImagePreview';

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
  const [isLoading, setIsLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArtworks();
  }, []);

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
    } catch (error) {
      console.error('Error fetching artworks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageClick = (imageUrl: string, title: string) => {
    setPreviewImage({ src: imageUrl, alt: title });
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
        ease: [0.4, 0, 0.2, 1]
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
      {/* Header with Admin Link */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-light text-gray-900">Gallery</h1>
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100">
                <Settings className="w-4 h-4 mr-2" />
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-4 py-8 text-center">
        {artworks.length === 0 ? (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-gray-500">No artworks found. Visit the admin panel to add some!</p>
          </motion.div>
        ) : (
          <motion.div 
            className="masonry-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {artworks.map((artwork) => (
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

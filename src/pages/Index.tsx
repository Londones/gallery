
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { sampleArtworks } from '@/data/sampleArtworks';
import ImagePreview from '@/components/ImagePreview';

interface Artwork {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  platformLink?: string;
  createdAt: string;
}

const Index = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Loading artworks...');
    console.log('Sample artworks:', sampleArtworks);
    
    // Load artworks from localStorage, fallback to sample data
    const stored = localStorage.getItem('artworks');
    if (stored) {
      const storedArtworks = JSON.parse(stored);
      console.log('Found stored artworks:', storedArtworks);
      if (storedArtworks.length > 0) {
        setArtworks(storedArtworks);
      } else {
        console.log('No stored artworks, using sample data');
        setArtworks(sampleArtworks);
      }
    } else {
      console.log('No localStorage data, using sample data');
      setArtworks(sampleArtworks);
    }
  }, []);

  useEffect(() => {
    console.log('Current artworks state:', artworks);
  }, [artworks]);

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
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
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
        {artworks.length === 0 ? (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-gray-500">Loading artworks...</p>
          </motion.div>
        ) : (
          <motion.div 
            className="masonry-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {artworks.map((artwork, index) => (
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
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  className="w-full rounded-lg transition-all duration-300"
                  layoutId={`artwork-image-${artwork.id}`}
                  onError={(e) => {
                    console.error('Image failed to load:', artwork.imageUrl);
                    console.error('Error:', e);
                  }}
                  onLoad={() => console.log('Image loaded successfully:', artwork.imageUrl)}
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

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Calendar, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import ImagePreview from '@/components/ImagePreview';
import ArtworkDetailSkeleton from '@/components/ArtworkDetailSkeleton';

interface Artwork {
  id: string;
  title: string;
  description: string;
  image_url: string;
  platform_link?: string;
  created_at: string;
}

const ArtworkDetail = () => {
  const { id } = useParams();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    if (id) {
      fetchArtwork(id);
    }
  }, [id]);

  const fetchArtwork = async (artworkId: string) => {
    try {
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .eq('id', artworkId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching artwork:', error);
        return;
      }

      setArtwork(data);
    } catch (error) {
      console.error('Error fetching artwork:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const updateMetaTag = (attribute: 'name' | 'property', value: string, content: string) => {
      let meta = document.querySelector(`meta[${attribute}="${value}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, value);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };
    
    if (artwork) {
      document.title = `${artwork.title} - Art Gallery`;
      
      const description = artwork.description || 'View this beautiful artwork';

      // Update OG tags
      updateMetaTag('property', 'og:title', artwork.title);
      updateMetaTag('property', 'og:description', description);
      updateMetaTag('property', 'og:image', artwork.image_url);
      updateMetaTag('property', 'og:type', 'article');
      
      // Update Twitter tags
      updateMetaTag('name', 'twitter:card', 'summary_large_image');
      updateMetaTag('name', 'twitter:title', artwork.title);
      updateMetaTag('name', 'twitter:description', description);
      updateMetaTag('name', 'twitter:image', artwork.image_url);
    }
  }, [artwork]);

  if (isLoading) {
    return <ArtworkDetailSkeleton />;
  }

  if (!artwork) {
    return (
      <motion.div 
        className="min-h-screen bg-white flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="text-center">
          <h2 className="text-2xl font-light text-gray-800 mb-4">Artwork not found</h2>
          <Link to="/">
            <Button variant="outline" className="border-gray-200 text-gray-600 bg-white hover:bg-gray-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Gallery
            </Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  const handleImageClick = () => {
    setPreviewImage({ src: artwork.image_url, alt: artwork.title });
  };

  return (
    <motion.div 
      className="min-h-screen bg-white overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Minimal Header */}
      <motion.header 
        className="absolute top-0 left-0 z-50 p-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Link to="/">
          <Button variant="ghost" className="text-gray-400 hover:text-gray-800 hover:bg-gray-50 border-none p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
      </motion.header>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row min-h-screen pt-16 lg:pt-0">
        {/* Image Section */}
        <motion.div 
          className="flex-1 flex items-center justify-center p-8 lg:p-16 cursor-pointer group overflow-hidden" 
          onClick={handleImageClick}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <motion.img
              src={artwork.image_url}
              alt={artwork.title}
              className="max-w-full max-h-full object-contain shadow-sm group-hover:shadow-md transition-shadow duration-300"
              style={{ maxHeight: 'calc(100vh - 8rem)' }}
              layoutId={`artwork-image-${artwork.id}`}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div 
              className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                <Eye className="w-5 h-5 text-gray-600" />
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Info Panel */}
        <motion.div 
          className="w-full lg:w-80 bg-gray-50/30 p-8 lg:p-12 flex flex-col justify-center border-l border-gray-100 overflow-y-auto"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="space-y-8">
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <h1 className="text-2xl lg:text-3xl font-light text-gray-900 leading-tight">
                {artwork.title}
              </h1>
              {artwork.description && (
                <p className="text-gray-600 leading-relaxed text-base">
                  {artwork.description}
                </p>
              )}
            </motion.div>

            <motion.div 
              className="space-y-6 pt-6 border-t border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              <div className="flex items-center text-gray-500 text-sm">
                <Calendar className="w-4 h-4 mr-3" />
                {new Date(artwork.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>

              {artwork.platform_link && (
                <motion.a
                  href={artwork.platform_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="outline" 
                    className="border-gray-200 text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Platform
                  </Button>
                </motion.a>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>

      <ImagePreview
        src={previewImage?.src || ''}
        alt={previewImage?.alt || ''}
        isOpen={!!previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </motion.div>
  );
};

export default ArtworkDetail;

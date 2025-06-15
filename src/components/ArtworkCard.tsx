
import { motion } from 'framer-motion';

interface Artwork {
  id: string;
  title: string;
  description: string;
  image_url: string;
  platform_link?: string;
  created_at: string;
}

interface ArtworkCardProps {
  artwork: Artwork;
  onClick: (artworkId: string) => void;
}

const ArtworkCard = ({ artwork, onClick }: ArtworkCardProps) => {
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

  return (
    <motion.div 
      className="masonry-item group relative cursor-pointer mb-4 break-inside-avoid"
      variants={itemVariants}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(artwork.id)}
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
  );
};

export default ArtworkCard;

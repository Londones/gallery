
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
  isDuplicate?: boolean;
}

const ArtworkCard = ({ artwork, onClick, isDuplicate = false }: ArtworkCardProps) => {
  return (
    <motion.div 
      className="group relative cursor-pointer"
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(artwork.id)}
      layoutId={!isDuplicate ? `artwork-${artwork.id}` : undefined}
    >
      <motion.img
        src={artwork.image_url}
        alt={artwork.title}
        className="w-full rounded-lg transition-all duration-300"
        layoutId={!isDuplicate ? `artwork-image-${artwork.id}` : undefined}
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

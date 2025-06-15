
import { motion } from 'framer-motion';
import ArtworkCard from './ArtworkCard';

interface Artwork {
  id: string;
  title: string;
  description: string;
  image_url: string;
  platform_link?: string;
  created_at: string;
}

interface ArtworkGridProps {
  artworks: Artwork[];
  onArtworkClick: (artworkId: string) => void;
}

const ArtworkGrid = ({ artworks, onArtworkClick }: ArtworkGridProps) => {
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

  return (
    <motion.div 
      className="masonry-grid"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {artworks.map((artwork) => (
        <ArtworkCard 
          key={artwork.id}
          artwork={artwork}
          onClick={onArtworkClick}
        />
      ))}
    </motion.div>
  );
};

export default ArtworkGrid;

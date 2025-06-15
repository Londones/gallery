
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
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const getColumnVariants = (columnIndex: number) => ({
    hidden: { 
      opacity: 0,
      y: columnIndex % 2 === 0 ? 50 : -50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: columnIndex * 0.15
      }
    }
  });

  // Group artworks by columns based on screen size
  const getColumnCount = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1280) return 4;
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 640) return 2;
    }
    return 1;
  };

  const columnCount = getColumnCount();
  const columns = Array.from({ length: columnCount }, () => [] as Artwork[]);
  
  artworks.forEach((artwork, index) => {
    columns[index % columnCount].push(artwork);
  });

  return (
    <motion.div 
      className="masonry-grid"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {columns.map((columnArtworks, columnIndex) => (
        <motion.div
          key={columnIndex}
          className={`masonry-column ${columnIndex % 2 === 0 ? 'scroll-down' : 'scroll-up'}`}
          variants={getColumnVariants(columnIndex)}
        >
          {columnArtworks.map((artwork) => (
            <ArtworkCard 
              key={artwork.id}
              artwork={artwork}
              onClick={onArtworkClick}
            />
          ))}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ArtworkGrid;

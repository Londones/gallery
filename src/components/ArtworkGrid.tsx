
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
  // Duplicate artworks to ensure infinite scroll
  const duplicatedArtworks = [...artworks, ...artworks, ...artworks];
  
  // Split artworks into columns based on current breakpoint
  const getColumnsCount = () => {
    if (typeof window === 'undefined') return 1;
    if (window.innerWidth >= 1280) return 4;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  };

  const columnsCount = getColumnsCount();
  const columns: Artwork[][] = Array.from({ length: columnsCount }, () => []);
  
  // Distribute artworks across columns
  duplicatedArtworks.forEach((artwork, index) => {
    columns[index % columnsCount].push(artwork);
  });

  return (
    <div className="flex gap-4 justify-center max-w-7xl mx-auto overflow-hidden h-screen">
      {columns.map((columnArtworks, columnIndex) => (
        <motion.div
          key={columnIndex}
          className="flex flex-col gap-4 flex-1 max-w-80"
          animate={{
            y: columnIndex % 2 === 0 ? [0, -2000] : [0, 2000]
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {columnArtworks.map((artwork, artworkIndex) => (
            <ArtworkCard 
              key={`${artwork.id}-${artworkIndex}`}
              artwork={artwork}
              onClick={onArtworkClick}
            />
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export default ArtworkGrid;


import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
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
  const [columnsCount, setColumnsCount] = useState(1);

  // Update columns count on window resize
  useEffect(() => {
    const updateColumnsCount = () => {
      if (window.innerWidth >= 1280) setColumnsCount(4);
      else if (window.innerWidth >= 1024) setColumnsCount(3);
      else if (window.innerWidth >= 640) setColumnsCount(2);
      else setColumnsCount(1);
    };

    updateColumnsCount();
    window.addEventListener('resize', updateColumnsCount);
    return () => window.removeEventListener('resize', updateColumnsCount);
  }, []);

  // Create enough duplicates to ensure continuous scrolling
  const duplicatedArtworks = [...artworks, ...artworks, ...artworks, ...artworks];
  
  // Distribute artworks across columns
  const columns: Artwork[][] = Array.from({ length: columnsCount }, () => []);
  duplicatedArtworks.forEach((artwork, index) => {
    columns[index % columnsCount].push(artwork);
  });

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 overflow-hidden" style={{ height: '100vh' }}>
      {/* Top fade overlay */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
      
      {/* Bottom fade overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
      
      <div className="flex gap-4 h-full items-start">
        {columns.map((columnArtworks, columnIndex) => (
          <motion.div
            key={columnIndex}
            className="flex-1 flex flex-col gap-4"
            animate={{
              y: columnIndex % 2 === 0 ? [0, -2000, 0] : [0, 2000, 0]
            }}
            transition={{
              duration: 60,
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop"
            }}
          >
            {columnArtworks.map((artwork, artworkIndex) => (
              <ArtworkCard 
                key={`${artwork.id}-${columnIndex}-${artworkIndex}`}
                artwork={artwork}
                onClick={onArtworkClick}
              />
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ArtworkGrid;

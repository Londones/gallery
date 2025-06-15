
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import ArtworkCard from './ArtworkCard';
import { useBreakpoint } from '@/hooks/useBreakpoint';

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
  const numColumns = useBreakpoint();

  const columns = useMemo(() => {
    if (!artworks || artworks.length === 0) {
      return [];
    }
    const cols: Artwork[][] = Array.from({ length: numColumns }, () => []);
    artworks.forEach((artwork, i) => {
      cols[i % numColumns].push(artwork);
    });
    return cols;
  }, [artworks, numColumns]);

  if (columns.length === 0) {
    return null;
  }

  const getAnimationDuration = (columnArtworks: Artwork[]) => {
    const duration = columnArtworks.length * 12; // 12 seconds per item
    return Math.max(duration, 40); // minimum duration 40s
  };

  return (
    <div className="scrolling-grid" aria-label="Artworks gallery with scrolling columns">
      {columns.map((columnArtworks, i) => (
        <div key={i} className="scrolling-column">
          <motion.div
            className="scrolling-column-content"
            style={{
              animationName: i % 2 === 0 ? 'scroll-down' : 'scroll-up',
              animationDuration: `${getAnimationDuration(columnArtworks)}s`,
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite',
            }}
          >
            {[...columnArtworks, ...columnArtworks].map((artwork, j) => (
              <ArtworkCard
                key={`${artwork.id}-${j}`}
                artwork={artwork}
                onClick={onArtworkClick}
                isDuplicate={j >= columnArtworks.length}
              />
            ))}
          </motion.div>
        </div>
      ))}
    </div>
  );
};

export default ArtworkGrid;

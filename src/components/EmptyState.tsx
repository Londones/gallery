
import { motion } from 'framer-motion';

interface EmptyStateProps {
  searchQuery?: string;
}

const EmptyState = ({ searchQuery }: EmptyStateProps) => {
  const searchEmojis = ['🌸', '💖', '🎀'];
  const emptyEmojis = ['🌺', '💕', '🌷'];
  
  const emojis = searchQuery ? searchEmojis : emptyEmojis;
  const message = searchQuery 
    ? `No artworks found matching "${searchQuery}"` 
    : 'This gallery awaits its first masterpiece';

  return (
    <motion.div 
      className="text-center py-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-center items-center space-x-1 text-lg">
        {emojis.map((emoji, index) => (
          <span key={index}>
            {emoji}
          </span>
        ))}
      </div>
      <p className="text-gray-400 mt-4 text-sm">{message}</p>
    </motion.div>
  );
};

export default EmptyState;

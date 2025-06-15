
import { motion } from 'framer-motion';

interface EmptyStateProps {
  searchQuery?: string;
}

const EmptyState = ({ searchQuery }: EmptyStateProps) => {
  const emojiVariants = {
    bounce: {
      y: [0, -8, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const searchEmojis = ['🌸', '💖', '🎀'];
  const emptyEmojis = ['🌺', '💕', '🌷'];
  
  const emojis = searchQuery ? searchEmojis : emptyEmojis;
  const message = searchQuery 
    ? `No artworks found matching "${searchQuery}"` 
    : 'Your gallery awaits its first masterpiece';

  return (
    <motion.div 
      className="text-center py-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-center items-center space-x-1 text-2xl">
        {emojis.map((emoji, index) => (
          <motion.span
            key={index}
            variants={emojiVariants}
            animate="bounce"
            transition={{ delay: index * 0.2 }}
          >
            {emoji}
          </motion.span>
        ))}
      </div>
      <p className="text-gray-400 mt-4 text-sm">{message}</p>
    </motion.div>
  );
};

export default EmptyState;

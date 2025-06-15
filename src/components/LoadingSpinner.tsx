
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <motion.div 
      className="min-h-screen bg-white flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Removed loading message */}
    </motion.div>
  );
};

export default LoadingSpinner;

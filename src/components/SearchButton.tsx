
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchButtonProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const SearchButton = ({ searchQuery, onSearchChange }: SearchButtonProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    if (isExpanded && searchQuery) {
      onSearchChange('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.button
            key="search-button"
            onClick={handleToggle}
            className="bg-white text-gray-800 rounded-full p-4 shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-200"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Search className="h-6 w-6" />
          </motion.button>
        ) : (
          <motion.div
            key="search-bar"
            className="bg-white rounded-full shadow-lg border border-gray-200 p-2 flex items-center gap-2 min-w-[280px]"
            initial={{ scale: 0, opacity: 0, width: 56 }}
            animate={{ scale: 1, opacity: 1, width: 'auto' }}
            exit={{ scale: 0, opacity: 0, width: 56 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="flex items-center gap-2 flex-1 px-2">
              <Search className="h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search artworks..."
                value={searchQuery}
                onChange={handleInputChange}
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto text-sm placeholder:text-gray-400"
                autoFocus
              />
            </div>
            <motion.button
              onClick={handleToggle}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="h-4 w-4 text-gray-500" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchButton;

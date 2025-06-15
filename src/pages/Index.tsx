
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Settings, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import ArtworkGrid from '@/components/ArtworkGrid';
import EmptyState from '@/components/EmptyState';

interface Artwork {
  id: string;
  title: string;
  description: string;
  image_url: string;
  platform_link?: string;
  created_at: string;
}

const Index = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Update page title when component mounts
    document.title = 'Gallery';
  }, []);

  useEffect(() => {
    fetchArtworks();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = artworks.filter(artwork =>
        artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artwork.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredArtworks(filtered);
    } else {
      setFilteredArtworks(artworks);
    }
  }, [artworks, searchQuery]);

  const fetchArtworks = async () => {
    try {
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArtworks(data || []);
    } catch (error) {
      console.error('Error fetching artworks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleArtworkClick = (artworkId: string) => {
    navigate(`/artwork/${artworkId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center py-16">
          <p className="text-gray-500">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 to-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <motion.header 
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <motion.h1 
              className="text-3xl font-light text-gray-900"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Gallery
            </motion.h1>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <motion.div 
                className="relative"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search artworks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 border-gray-200 focus:border-pink-300 focus:ring-pink-200 bg-white/70"
                />
              </motion.div>

              {/* Admin Button */}
              {user && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link to="/admin">
                    <Button variant="outline" size="sm" className="border-gray-200 text-gray-700 bg-white/70 hover:bg-gray-50">
                      <Settings className="w-4 h-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                </motion.div>
              )}

              {/* Auth Button */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link to="/auth">
                  <Button variant="ghost" size="sm" className="text-gray-700 hover:bg-gray-100">
                    <User className="w-4 h-4 mr-2" />
                    {user ? 'Account' : 'Sign In'}
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {filteredArtworks.length === 0 ? (
          <EmptyState searchQuery={searchQuery} />
        ) : (
          <ArtworkGrid 
            artworks={filteredArtworks} 
            onArtworkClick={handleArtworkClick}
          />
        )}
      </main>
    </motion.div>
  );
};

export default Index;

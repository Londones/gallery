import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSubdomain } from '@/hooks/useSubdomain';
import { useProfile } from '@/hooks/useProfile';
import ArtworkGrid from '@/components/ArtworkGrid';
import EmptyState from '@/components/EmptyState';
import SearchButton from '@/components/SearchButton';
import ArtworkGridSkeleton from '@/components/ArtworkGridSkeleton';
import Home from './Home';

interface Artwork {
  id: string;
  title: string;
  description: string;
  image_url: string;
  platform_link?: string;
  created_at: string;
  user_id: string;
}

const Index = () => {
  const { subdomain, isMainDomain } = useSubdomain();
  const { profile, loading: profileLoading, error: profileError } = useProfile(subdomain || undefined);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // If it's the main domain, show the home page
  if (isMainDomain) {
    return <Home />;
  }

  // If subdomain is detected but profile is not found
  if (!profileLoading && !profile && subdomain) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="text-center">
          <h1 className="text-4xl font-light text-gray-900 mb-4">Gallery Not Found</h1>
          <p className="text-gray-600 mb-8">The gallery "{subdomain}" doesn't exist.</p>
          <Link 
            to="/" 
            className="inline-flex items-center text-gray-600 hover:text-gray-800"
            onClick={() => window.location.href = 'https://gallery.com'}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Gallery
          </Link>
        </div>
      </motion.div>
    );
  }

  const updateMetaTag = (attribute: 'name' | 'property', value: string, content: string) => {
    let meta = document.querySelector(`meta[${attribute}="${value}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attribute, value);
      document.head.appendChild(meta);
    }
    meta.content = content;
  };

  useEffect(() => {
    if (profile) {
      const title = `${profile.display_name}'s Gallery`;
      const description = profile.bio || `Discover artwork by ${profile.display_name}`;

      document.title = title;
      updateMetaTag('property', 'og:title', title);
      updateMetaTag('name', 'twitter:title', title);
      updateMetaTag('property', 'og:description', description);
      updateMetaTag('name', 'twitter:description', description);
      updateMetaTag('property', 'og:type', 'website');
      updateMetaTag('property', 'og:url', window.location.href);
      
      fetchArtworks();
    }
  }, [profile]);

  useEffect(() => {
    if (artworks.length > 0) {
      const latestArtwork = artworks[0];
      updateMetaTag('property', 'og:image', latestArtwork.image_url);
      updateMetaTag('name', 'twitter:image', latestArtwork.image_url);
    }
  }, [artworks]);

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
    if (!profile) return;
    
    try {
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .eq('user_id', profile.id)
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

  if (profileLoading || isLoading) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-gray-50 to-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <ArtworkGridSkeleton />
      </motion.div>
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
      <header className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-light text-gray-900 mb-2">
            {profile?.display_name}'s Gallery
          </h1>
          {profile?.bio && (
            <p className="text-gray-600 max-w-2xl mx-auto">{profile.bio}</p>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-8">
        {filteredArtworks.length === 0 ? (
          <EmptyState searchQuery={searchQuery} />
        ) : (
          <ArtworkGrid 
            artworks={filteredArtworks} 
            onArtworkClick={handleArtworkClick}
          />
        )}
      </main>

      {/* Floating Search Button */}
      {artworks.length > 0 && (
        <SearchButton 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      )}
    </motion.div>
  );
};

export default Index;

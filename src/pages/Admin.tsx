import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AdminHeader from '@/components/AdminHeader';
import ArtworkForm from '@/components/ArtworkForm';
import ArtworkManagement from '@/components/ArtworkManagement';
import ArtworkPreview from '@/components/ArtworkPreview';

interface Artwork {
  id: string;
  title: string;  
  description: string;
  image_url: string;
  platform_link?: string;
  created_at: string;
  user_id: string;
}

const Admin = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Admin Panel - Gallery';
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchArtworks();
    }
  }, [user]);

  const fetchArtworks = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArtworks(data || []);
    } catch (error) {
      console.error('Error fetching artworks:', error);
      toast({
        title: "Error",
        description: "Failed to load artworks. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleArtworkSaved = (artwork: Artwork) => {
    if (editingArtwork) {
      setArtworks(prev => prev.map(art => art.id === editingArtwork.id ? artwork : art));
    } else {
      setArtworks(prev => [artwork, ...prev]);
    }
    setEditingArtwork(null);
  };

  const handleEditingCancelled = () => {
    setEditingArtwork(null);
  };

  const handleEditArtwork = (artwork: Artwork) => {
    setEditingArtwork(artwork);
  };

  const handleArtworkDeleted = (artworkId: string) => {
    setArtworks(prev => prev.filter(art => art.id !== artworkId));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center py-16">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <AdminHeader onSignOut={handleSignOut} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ArtworkForm 
              editingArtwork={editingArtwork}
              onArtworkSaved={handleArtworkSaved}
              onEditingCancelled={handleEditingCancelled}
            />
          </div>
          
          <div className="lg:col-span-1">
            <ArtworkManagement 
              artworks={artworks}
              onEditArtwork={handleEditArtwork}
              onArtworkDeleted={handleArtworkDeleted}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;

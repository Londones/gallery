import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Save, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  username: string;
  display_name: string;
  bio?: string;
  avatar_url?: string;
}

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    display_name: '',
    bio: '',
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Profile Settings - Gallery';
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      setProfile(data);
      setFormData({
        username: data.username || '',
        display_name: data.display_name || '',
        bio: data.bio || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !profile) return;

    // Validate username
    if (!formData.username.trim()) {
      toast({
        title: "Username Required",
        description: "Please enter a username.",
        variant: "destructive"
      });
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      toast({
        title: "Invalid Username",
        description: "Username can only contain letters, numbers, underscores, and hyphens.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          username: formData.username.trim(),
          display_name: formData.display_name.trim() || formData.username.trim(),
          bio: formData.bio.trim() || null,
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Username Taken",
            description: "This username is already taken. Please choose another one.",
            variant: "destructive"
          });
          return;
        }
        throw error;
      }

      setProfile(data);
      toast({
        title: "Success!",
        description: "Your profile has been updated.",
      });
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || isLoading) {
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

  const galleryUrl = `https://${profile?.username}.gallery.com`;

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 to-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Navigation */}
          <div className="flex justify-between items-center mb-8">
            <Button
              variant="outline"
              onClick={() => navigate('/admin')}
              className="border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Back to Admin
            </Button>
            
            {profile?.username && (
              <Button
                variant="outline"
                onClick={() => window.open(galleryUrl, '_blank')}
                className="border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Gallery
              </Button>
            )}
          </div>

          <Card className="bg-white/70 backdrop-blur-sm border-gray-100">
            <CardHeader>
              <CardTitle className="text-gray-900 font-light text-xl flex items-center">
                <User className="w-5 h-5 mr-2" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-800">
                    Username *
                  </Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Enter your username"
                    className="border-gray-200 focus:border-pink-300 focus:ring-pink-200"
                  />
                  <p className="text-xs text-gray-500">
                    Your gallery will be available at: <span className="font-mono">{formData.username || 'username'}.gallery.com</span>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="display_name" className="text-gray-800">
                    Display Name
                  </Label>
                  <Input
                    id="display_name"
                    value={formData.display_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                    placeholder="Enter your display name"
                    className="border-gray-200 focus:border-pink-300 focus:ring-pink-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-gray-800">
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell people about yourself and your art..."
                    rows={4}
                    className="border-gray-200 focus:border-pink-300 focus:ring-pink-200"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                >
                  {isSaving ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Profile
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
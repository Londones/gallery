import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Save, Trash2, Eye, ExternalLink, LogOut, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  validateArtworkTitle, 
  validateArtworkDescription, 
  validatePlatformLink, 
  validateImageFile,
  sanitizeText 
} from '@/utils/inputValidation';

interface Artwork {
  id: string;
  title: string;  
  description: string;
  image_url: string;
  platform_link?: string;
  created_at: string;
}

const Admin = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    platformLink: '',
    imageFile: null as File | null
  });
  const { toast } = useToast();
  const navigate = useNavigate();

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
    try {
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate the image file
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        toast({
          title: "Invalid File",
          description: validation.error,
          variant: "destructive"
        });
        return;
      }
      setFormData(prev => ({ ...prev, imageFile: file }));
    }
  };

  const uploadImageToStorage = async (file: File): Promise<string> => {
    const fileName = `${Date.now()}-${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('artworks')
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('artworks')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const validateForm = () => {
    // Validate title
    const titleValidation = validateArtworkTitle(formData.title);
    if (!titleValidation.isValid) {
      toast({
        title: "Invalid Title",
        description: titleValidation.error,
        variant: "destructive"
      });
      return false;
    }

    // Validate description
    const descriptionValidation = validateArtworkDescription(formData.description);
    if (!descriptionValidation.isValid) {
      toast({
        title: "Invalid Description",
        description: descriptionValidation.error,
        variant: "destructive"
      });
      return false;
    }

    // Validate platform link
    const platformValidation = validatePlatformLink(formData.platformLink);
    if (!platformValidation.isValid) {
      toast({
        title: "Invalid Platform Link",
        description: platformValidation.error,
        variant: "destructive"
      });
      return false;
    }

    // Validate image for new artwork
    if (!editingArtwork && !formData.imageFile) {
      toast({
        title: "Image Required",
        description: "Please select an image file.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsUploading(true);

    try {
      if (editingArtwork) {
        // Update existing artwork
        let imageUrl = editingArtwork.image_url;
        
        // Upload new image if provided
        if (formData.imageFile) {
          imageUrl = await uploadImageToStorage(formData.imageFile);
        }

        const { data, error } = await supabase
          .from('artworks')
          .update({
            title: sanitizeText(formData.title.trim()),
            description: formData.description.trim() ? sanitizeText(formData.description.trim()) : null,
            image_url: imageUrl,
            platform_link: formData.platformLink.trim() || null
          })
          .eq('id', editingArtwork.id)
          .select()
          .single();

        if (error) throw error;

        // Update local state
        setArtworks(prev => prev.map(art => art.id === editingArtwork.id ? data : art));
        
        // Reset form
        resetForm();

        toast({
          title: "Success!",
          description: "Artwork has been updated."
        });
      } else {
        // Create new artwork
        const imageUrl = await uploadImageToStorage(formData.imageFile!);

        // Insert artwork record
        const { data, error } = await supabase
          .from('artworks')
          .insert({
            title: sanitizeText(formData.title.trim()),
            description: formData.description.trim() ? sanitizeText(formData.description.trim()) : null,
            image_url: imageUrl,
            platform_link: formData.platformLink.trim() || null
          })
          .select()
          .single();

        if (error) throw error;

        // Update local state
        setArtworks(prev => [data, ...prev]);

        // Reset form
        resetForm();

        toast({
          title: "Success!",
          description: "Artwork has been added to your gallery."
        });
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      
      // Provide user-friendly error messages without exposing sensitive info
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      if (error.message?.includes('storage')) {
        errorMessage = "Failed to upload image. Please check your file and try again.";
      } else if (error.message?.includes('duplicate')) {
        errorMessage = "An artwork with this information already exists.";
      } else if (error.message?.includes('network')) {
        errorMessage = "Network error. Please check your connection and try again.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      platformLink: '',
      imageFile: null
    });
    setEditingArtwork(null);

    // Reset file input
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const startEditing = (artwork: Artwork) => {
    setEditingArtwork(artwork);
    setFormData({
      title: artwork.title,
      description: artwork.description || '',
      platformLink: artwork.platform_link || '',
      imageFile: null
    });
  };

  const cancelEditing = () => {
    resetForm();
  };

  const deleteArtwork = async (artwork: Artwork) => {
    try {
      // Delete from database
      const { error: dbError } = await supabase
        .from('artworks')
        .delete()
        .eq('id', artwork.id);

      if (dbError) throw dbError;

      // Try to delete from storage (but don't fail if it doesn't work)
      try {
        const fileName = artwork.image_url.split('/').pop();
        if (fileName) {
          await supabase.storage.from('artworks').remove([fileName]);
        }
      } catch (storageError) {
        console.warn('Could not delete image from storage:', storageError);
      }

      // Update local state
      setArtworks(prev => prev.filter(art => art.id !== artwork.id));
      
      toast({
        title: "Deleted",
        description: "Artwork has been removed from your gallery."
      });
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete artwork. Please try again.",
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
    return null; // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-gray-700 hover:bg-gray-100">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Gallery
                </Button>
              </Link>
              <h1 className="text-2xl font-light text-gray-900">
                Admin Panel
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <Link to="/">
                <Button variant="outline" size="sm" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                  <Eye className="w-4 h-4 mr-2" />
                  View Gallery
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut}
                className="text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload/Edit Form */}
          <Card className="bg-white/70 backdrop-blur-sm border-gray-100">
            <CardHeader>
              <CardTitle className="text-gray-900 font-light text-xl">
                {editingArtwork ? 'Edit Artwork' : 'Add New Artwork'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="image" className="text-gray-800">
                    Artwork Image {!editingArtwork && '*'}
                  </Label>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-pink-200 transition-colors">
                    <input
                      id="image"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label htmlFor="image" className="cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-600">
                        {formData.imageFile ? formData.imageFile.name : 
                         editingArtwork ? 'Click to replace image (optional)' : 'Click to upload image'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        JPEG, PNG, WebP, GIF • Max 5MB
                      </p>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-800">
                    Title * <span className="text-xs text-gray-500">(Max 100 characters)</span>
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter artwork title"
                    maxLength={100}
                    className="border-gray-200 focus:border-pink-300 focus:ring-pink-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-800">
                    Description <span className="text-xs text-gray-500">(Max 1000 characters)</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your artwork..."
                    rows={4}
                    maxLength={1000}
                    className="border-gray-200 focus:border-pink-300 focus:ring-pink-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="platform" className="text-gray-800">
                    Platform Link (Optional)
                  </Label>
                  <Input
                    id="platform"
                    type="url"
                    value={formData.platformLink}
                    onChange={(e) => setFormData(prev => ({ ...prev, platformLink: e.target.value }))}
                    placeholder="https://instagram.com/p/..."
                    className="border-gray-200 focus:border-pink-300 focus:ring-pink-200"
                  />
                  <p className="text-xs text-gray-500">
                    Supported: Instagram, Twitter/X, ArtStation, DeviantArt, Behance, Dribbble
                  </p>
                </div>

                <div className="flex space-x-3">
                  <Button 
                    type="submit" 
                    disabled={isUploading}
                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
                  >
                    {isUploading ? (
                      "Saving..."
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {editingArtwork ? 'Update Artwork' : 'Add Artwork'}
                      </>
                    )}
                  </Button>
                  
                  {editingArtwork && (
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={cancelEditing}
                      className="border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Artwork Management */}
          <Card className="bg-white/70 backdrop-blur-sm border-gray-100">
            <CardHeader>
              <CardTitle className="text-gray-900 font-light text-xl">
                Manage Artworks ({artworks.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {artworks.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">
                    No artworks uploaded yet.
                  </p>
                ) : (
                  artworks.map((artwork) => (
                    <div key={artwork.id} className="flex items-center space-x-4 p-3 bg-white/50 rounded-lg border border-gray-100">
                      <img
                        src={artwork.image_url}
                        alt={artwork.title}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {artwork.title}
                        </h4>
                        <p className="text-sm text-gray-600 truncate">
                          {artwork.description || 'No description'}
                        </p>
                        {artwork.platform_link && (
                          <a
                            href={artwork.platform_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-pink-400 hover:text-pink-500 flex items-center mt-1"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Platform
                          </a>
                        )}
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditing(artwork)}
                          className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteArtwork(artwork)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;

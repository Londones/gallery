
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Save, Trash2, Eye, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface Artwork {
  id: string;
  title: string;  
  description: string;
  imageUrl: string;
  platformLink?: string;
  createdAt: string;
}

const Admin = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    platformLink: '',
    imageFile: null as File | null
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('artworks');
    if (stored) {
      setArtworks(JSON.parse(stored));
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, imageFile: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageFile || !formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please provide both a title and an image.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      // Convert image to base64 for storage
      const reader = new FileReader();
      reader.onload = () => {
        const newArtwork: Artwork = {
          id: Date.now().toString(),
          title: formData.title.trim(),
          description: formData.description.trim(),
          imageUrl: reader.result as string,
          platformLink: formData.platformLink.trim() || undefined,
          createdAt: new Date().toISOString()
        };

        const updatedArtworks = [newArtwork, ...artworks];
        setArtworks(updatedArtworks);
        localStorage.setItem('artworks', JSON.stringify(updatedArtworks));

        setFormData({
          title: '',
          description: '',
          platformLink: '',
          imageFile: null
        });

        // Reset file input
        const fileInput = document.getElementById('image') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }

        toast({
          title: "Success!",
          description: "Artwork has been added to your gallery."
        });
      };
      reader.readAsDataURL(formData.imageFile);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload artwork. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const deleteArtwork = (id: string) => {
    const updatedArtworks = artworks.filter(artwork => artwork.id !== id);
    setArtworks(updatedArtworks);
    localStorage.setItem('artworks', JSON.stringify(updatedArtworks));
    toast({
      title: "Deleted",
      description: "Artwork has been removed from your gallery."
    });
  };

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
            <Link to="/">
              <Button variant="outline" size="sm" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                <Eye className="w-4 h-4 mr-2" />
                View Gallery
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Form */}
          <Card className="bg-white/70 backdrop-blur-sm border-gray-100">
            <CardHeader>
              <CardTitle className="text-gray-900 font-light text-xl">
                Add New Artwork
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="image" className="text-gray-800">
                    Artwork Image *
                  </Label>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-pink-200 transition-colors">
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label htmlFor="image" className="cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-600">
                        {formData.imageFile ? formData.imageFile.name : 'Click to upload image'}
                      </p>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-800">
                    Title *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter artwork title"
                    className="border-gray-200 focus:border-pink-300 focus:ring-pink-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-800">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your artwork..."
                    rows={4}
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
                </div>

                <Button 
                  type="submit" 
                  disabled={isUploading}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                >
                  {isUploading ? (
                    "Uploading..."
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Add Artwork
                    </>
                  )}
                </Button>
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
                        src={artwork.imageUrl}
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
                        {artwork.platformLink && (
                          <a
                            href={artwork.platformLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-pink-400 hover:text-pink-500 flex items-center mt-1"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Platform
                          </a>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteArtwork(artwork.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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

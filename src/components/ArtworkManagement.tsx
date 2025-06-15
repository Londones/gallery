
import { Edit2, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Artwork {
  id: string;
  title: string;  
  description: string;
  image_url: string;
  platform_link?: string;
  created_at: string;
}

interface ArtworkManagementProps {
  artworks: Artwork[];
  onEditArtwork: (artwork: Artwork) => void;
  onArtworkDeleted: (artworkId: string) => void;
}

const ArtworkManagement = ({ artworks, onEditArtwork, onArtworkDeleted }: ArtworkManagementProps) => {
  const { toast } = useToast();

  const deleteArtwork = async (artwork: Artwork) => {
    try {
      const { error: dbError } = await supabase
        .from('artworks')
        .delete()
        .eq('id', artwork.id);

      if (dbError) throw dbError;

      try {
        const fileName = artwork.image_url.split('/').pop();
        if (fileName) {
          await supabase.storage.from('artworks').remove([fileName]);
        }
      } catch (storageError) {
        console.warn('Could not delete image from storage:', storageError);
      }

      onArtworkDeleted(artwork.id);
      
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

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-gray-100 flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-gray-900 font-light text-xl">
          Manage Artworks ({artworks.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        <div className="space-y-4 flex-1 overflow-y-auto">
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
                    onClick={() => onEditArtwork(artwork)}
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
  );
};

export default ArtworkManagement;

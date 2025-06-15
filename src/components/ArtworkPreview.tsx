
import { ExternalLink, Calendar, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Artwork {
  id: string;
  title: string;  
  description: string;
  image_url: string;
  platform_link?: string;
  created_at: string;
}

interface ArtworkPreviewProps {
  artwork: Artwork;
}

const ArtworkPreview = ({ artwork }: ArtworkPreviewProps) => {
  return (
    <Card className="bg-white/70 backdrop-blur-sm border-gray-100 h-fit">
      <CardHeader>
        <CardTitle className="text-gray-900 font-light text-xl flex items-center">
          <Eye className="w-5 h-5 mr-2 text-gray-600" />
          Current Artwork
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
          <img
            src={artwork.image_url}
            alt={artwork.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900 text-lg">
            {artwork.title}
          </h3>
          
          {artwork.description && (
            <p className="text-gray-600 text-sm leading-relaxed">
              {artwork.description}
            </p>
          )}
          
          <div className="flex items-center text-gray-500 text-xs">
            <Calendar className="w-3 h-3 mr-2" />
            {new Date(artwork.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </div>
          
          {artwork.platform_link && (
            <a
              href={artwork.platform_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button 
                variant="outline" 
                size="sm"
                className="border-gray-200 text-gray-600 bg-white hover:bg-gray-50 w-full"
              >
                <ExternalLink className="w-3 h-3 mr-2" />
                View on Platform
              </Button>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ArtworkPreview;

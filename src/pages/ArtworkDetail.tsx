
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Artwork {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  platformLink?: string;
  createdAt: string;
}

const ArtworkDetail = () => {
  const { id } = useParams();
  const [artwork, setArtwork] = useState<Artwork | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('artworks');
    if (stored && id) {
      const artworks: Artwork[] = JSON.parse(stored);
      const found = artworks.find(art => art.id === id);
      setArtwork(found || null);
    }
  }, [id]);

  useEffect(() => {
    // Update document head for dynamic open graph
    if (artwork) {
      document.title = `${artwork.title} - Art Gallery`;
      
      // Update meta tags
      const updateMetaTag = (property: string, content: string) => {
        let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('property', property);
          document.head.appendChild(meta);
        }
        meta.content = content;
      };

      updateMetaTag('og:title', artwork.title);
      updateMetaTag('og:description', artwork.description || 'View this beautiful artwork');
      updateMetaTag('og:image', artwork.imageUrl);
      updateMetaTag('og:type', 'article');
      
      updateMetaTag('twitter:card', 'summary_large_image');
      updateMetaTag('twitter:title', artwork.title);
      updateMetaTag('twitter:description', artwork.description || 'View this beautiful artwork');
      updateMetaTag('twitter:image', artwork.imageUrl);
    }
  }, [artwork]);

  if (!artwork) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-light text-amber-900 mb-4">Artwork not found</h2>
          <Link to="/">
            <Button variant="outline" className="border-amber-200 text-amber-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Gallery
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-amber-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-amber-100">
        <div className="container mx-auto px-4 py-6">
          <Link to="/">
            <Button variant="ghost" className="text-amber-700 hover:bg-amber-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Gallery
            </Button>
          </Link>
        </div>
      </header>

      {/* Artwork Display */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/70 backdrop-blur-sm border-amber-100 overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-square md:aspect-video max-h-[70vh] overflow-hidden">
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  className="w-full h-full object-contain bg-white"
                />
              </div>
              
              <div className="p-8 space-y-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-light text-amber-900 mb-4 tracking-tight">
                    {artwork.title}
                  </h1>
                  {artwork.description && (
                    <p className="text-lg text-amber-700 leading-relaxed">
                      {artwork.description}
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-amber-100 space-y-4 sm:space-y-0">
                  <div className="flex items-center text-amber-600 text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(artwork.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>

                  {artwork.platformLink && (
                    <a
                      href={artwork.platformLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex"
                    >
                      <Button 
                        variant="outline" 
                        className="border-amber-200 text-amber-700 hover:bg-amber-50"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View on Platform
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ArtworkDetail;

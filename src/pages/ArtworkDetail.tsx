
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Calendar, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sampleArtworks } from '@/data/sampleArtworks';
import ImagePreview from '@/components/ImagePreview';

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
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('artworks');
    if (stored && id) {
      const artworks: Artwork[] = JSON.parse(stored);
      const found = artworks.find(art => art.id === id);
      if (found) {
        setArtwork(found);
      } else {
        // Fallback to sample artworks
        const sampleFound = sampleArtworks.find(art => art.id === id);
        setArtwork(sampleFound || null);
      }
    } else if (id) {
      // Use sample artworks if no stored artworks
      const sampleFound = sampleArtworks.find(art => art.id === id);
      setArtwork(sampleFound || null);
    }
  }, [id]);

  useEffect(() => {
    // Update document head for dynamic open graph
    if (artwork) {
      document.title = `${artwork.title} - Gallery`;
      
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-light text-white mb-4">Artwork not found</h2>
          <Link to="/">
            <Button variant="outline" className="border-gray-800 text-gray-300 bg-gray-900 hover:bg-gray-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Gallery
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleImageClick = () => {
    setPreviewImage({ src: artwork.imageUrl, alt: artwork.title });
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Minimal Header */}
      <header className="absolute top-0 left-0 z-50 p-6">
        <Link to="/">
          <Button variant="ghost" className="text-white hover:bg-white/10 border-none">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
      </header>

      {/* Full Screen Layout */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Image Section */}
        <div className="flex-1 relative group cursor-pointer" onClick={handleImageClick}>
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            className="w-full h-full object-contain bg-black"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <Eye className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        {/* Info Panel */}
        <div className="w-full lg:w-96 bg-gray-950 p-8 lg:p-12 flex flex-col justify-center">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-light text-white mb-4 tracking-tight">
                {artwork.title}
              </h1>
              {artwork.description && (
                <p className="text-gray-300 leading-relaxed text-lg">
                  {artwork.description}
                </p>
              )}
            </div>

            <div className="space-y-4 pt-8 border-t border-gray-800">
              <div className="flex items-center text-gray-400 text-sm">
                <Calendar className="w-4 h-4 mr-3" />
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
                    className="border-gray-700 text-gray-300 bg-transparent hover:bg-gray-800 hover:border-gray-600 mt-4"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Platform
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <ImagePreview
        src={previewImage?.src || ''}
        alt={previewImage?.alt || ''}
        isOpen={!!previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </div>
  );
};

export default ArtworkDetail;


import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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

const Index = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    console.log('Loading artworks...');
    console.log('Sample artworks:', sampleArtworks);
    
    // Load artworks from localStorage, fallback to sample data
    const stored = localStorage.getItem('artworks');
    if (stored) {
      const storedArtworks = JSON.parse(stored);
      console.log('Found stored artworks:', storedArtworks);
      if (storedArtworks.length > 0) {
        setArtworks(storedArtworks);
      } else {
        console.log('No stored artworks, using sample data');
        setArtworks(sampleArtworks);
      }
    } else {
      console.log('No localStorage data, using sample data');
      setArtworks(sampleArtworks);
    }
  }, []);

  useEffect(() => {
    console.log('Current artworks state:', artworks);
  }, [artworks]);

  const handleImageClick = (imageUrl: string, title: string) => {
    setPreviewImage({ src: imageUrl, alt: title });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-light text-black tracking-wide">
              Gallery
            </h1>
            <div className="w-16 h-px bg-pink-200 mx-auto mt-4"></div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-6xl md:text-8xl font-extralight text-black mb-8 tracking-tight leading-none">
            Visual
            <br />
            <span className="text-gray-600">Stories</span>
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            A curated collection of visual narratives, 
            each frame capturing a moment in time.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="pb-20 px-4">
        <div className="container mx-auto">
          {artworks.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500">Loading artworks...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 animate-stagger">
              {artworks.map((artwork, index) => (
                <Card 
                  key={artwork.id}
                  className="group border border-gray-200 bg-white hover:bg-gray-50 transition-all duration-500 hover:shadow-lg hover:shadow-gray-200/50"
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <CardContent className="p-0">
                    <div className="aspect-square overflow-hidden rounded-t-lg relative">
                      <img
                        src={artwork.imageUrl}
                        alt={artwork.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-pointer"
                        onClick={() => handleImageClick(artwork.imageUrl, artwork.title)}
                        onError={(e) => {
                          console.error('Image failed to load:', artwork.imageUrl);
                          console.error('Error:', e);
                        }}
                        onLoad={() => console.log('Image loaded successfully:', artwork.imageUrl)}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="bg-white/90 rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                          <Eye className="w-5 h-5 text-gray-700" />
                        </div>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <Link to={`/artwork/${artwork.id}`}>
                        <h3 className="text-xl font-medium text-black group-hover:text-gray-700 transition-colors cursor-pointer">
                          {artwork.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                        {artwork.description}
                      </p>
                      <div className="flex items-center justify-between pt-2">
                        <time className="text-xs text-gray-400">
                          {new Date(artwork.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short'
                          })}
                        </time>
                        {artwork.platformLink && (
                          <a
                            href={artwork.platformLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-pink-400 text-xs font-medium hover:text-pink-500 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View Original
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <ImagePreview
        src={previewImage?.src || ''}
        alt={previewImage?.alt || ''}
        isOpen={!!previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </div>
  );
};

export default Index;

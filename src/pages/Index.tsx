
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ExternalLink, Edit3 } from 'lucide-react';
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

const Index = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  useEffect(() => {
    // Load artworks from localStorage
    const stored = localStorage.getItem('artworks');
    if (stored) {
      setArtworks(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-amber-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-amber-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-light text-amber-900 tracking-wide">
              Art Gallery
            </h1>
            <Link to="/admin">
              <Button 
                variant="outline" 
                size="sm"
                className="border-amber-200 text-amber-700 hover:bg-amber-50 transition-all duration-300"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-extralight text-amber-900 mb-6 tracking-tight">
            Curated
            <br />
            <span className="text-amber-600">Collections</span>
          </h2>
          <p className="text-xl text-amber-700/70 max-w-2xl mx-auto leading-relaxed">
            A carefully selected showcase of artistic expressions, 
            each piece telling its own unique story.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="pb-20 px-4">
        <div className="container mx-auto">
          {artworks.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-amber-100 to-cream-200 rounded-full flex items-center justify-center">
                <Plus className="w-12 h-12 text-amber-400" />
              </div>
              <h3 className="text-2xl font-light text-amber-800 mb-4">
                No artwork yet
              </h3>
              <p className="text-amber-600 mb-8">
                Start building your collection by adding your first piece
              </p>
              <Link to="/admin">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                  Add First Artwork
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {artworks.map((artwork, index) => (
                <Link key={artwork.id} to={`/artwork/${artwork.id}`}>
                  <Card 
                    className="group cursor-pointer border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-200/20"
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    <CardContent className="p-0">
                      <div className="aspect-square overflow-hidden rounded-t-lg">
                        <img
                          src={artwork.imageUrl}
                          alt={artwork.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      <div className="p-6 space-y-3">
                        <h3 className="text-xl font-medium text-amber-900 group-hover:text-amber-700 transition-colors">
                          {artwork.title}
                        </h3>
                        <p className="text-amber-600/80 text-sm leading-relaxed line-clamp-3">
                          {artwork.description}
                        </p>
                        {artwork.platformLink && (
                          <div className="flex items-center text-amber-500 text-xs font-medium">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View Original
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;

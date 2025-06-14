
interface Artwork {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  platformLink?: string;
  createdAt: string;
}

export const sampleArtworks: Artwork[] = [
  {
    id: '1',
    title: 'Urban Geometry',
    description: 'A study in architectural forms and shadows, exploring the relationship between light and structure in modern cityscapes.',
    imageUrl: 'https://images.unsplash.com/photo-1527576539890-dfa815648363?w=800&h=800&fit=crop&crop=center',
    platformLink: 'https://instagram.com/p/sample1',
    createdAt: '2024-06-10T10:00:00.000Z'
  },
  {
    id: '2',
    title: 'Minimalist Expression',
    description: 'Clean lines and negative space create a dialogue between presence and absence, questioning what we see versus what we perceive.',
    imageUrl: 'https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?w=800&h=800&fit=crop&crop=center',
    createdAt: '2024-06-08T14:30:00.000Z'
  },
  {
    id: '3',
    title: 'Natural Patterns',
    description: 'Nature\'s own geometry revealed through careful observation, showcasing the inherent design principles found in organic forms.',
    imageUrl: 'https://images.unsplash.com/photo-1452960962994-acf4fd70b632?w=800&h=800&fit=crop&crop=center',
    platformLink: 'https://behance.net/sample3',
    createdAt: '2024-06-05T09:15:00.000Z'
  },
  {
    id: '4',
    title: 'Textural Study',
    description: 'An exploration of surface and texture, where tactile qualities are translated into visual language through contrast and form.',
    imageUrl: 'https://images.unsplash.com/photo-1487252665478-49b61b47f302?w=800&h=800&fit=crop&crop=center',
    createdAt: '2024-06-02T16:45:00.000Z'
  }
];

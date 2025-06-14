
import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImagePreviewProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

const ImagePreview = ({ src, alt, isOpen, onClose }: ImagePreviewProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="relative max-w-[95vw] max-h-[95vh]">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:bg-white/10 z-10"
        >
          <X className="w-6 h-6" />
        </Button>
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-full object-contain rounded-lg"
        />
      </div>
    </div>
  );
};

export default ImagePreview;

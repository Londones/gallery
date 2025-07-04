
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

  const handleContainerClick = (e: React.MouseEvent) => {
    // Close if clicking anywhere except on the image
    const target = e.target as HTMLElement;
    if (target.tagName !== 'IMG') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
      {/* Fixed Header with Close Button */}
      <div className="flex justify-end p-4 flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/10 z-10"
        >
          <X className="w-6 h-6" />
        </Button>
      </div>
      
      {/* Scrollable Content Area - clicking here closes the modal */}
      <div 
        className="flex-1 overflow-auto p-4 pt-0 cursor-pointer"
        onClick={handleContainerClick}
      >
        <div className="flex items-center justify-center min-h-full">
          <img
            src={src}
            alt={alt}
            className="max-w-full h-auto object-contain rounded-lg cursor-default"
          />
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;

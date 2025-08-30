import { useState, useEffect } from 'react';

export const useSubdomain = () => {
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const [isMainDomain, setIsMainDomain] = useState(true);

  useEffect(() => {
    const hostname = window.location.hostname;
    
    // For development (localhost) or if it's the main domain
    if (hostname === 'localhost' || hostname.includes('lovable.app') || hostname.includes('gallery.com')) {
      setIsMainDomain(true);
      setSubdomain(null);
    } else {
      // Extract subdomain (everything before the first dot)
      const parts = hostname.split('.');
      if (parts.length > 2) {
        const extractedSubdomain = parts[0];
        setSubdomain(extractedSubdomain);
        setIsMainDomain(false);
      } else {
        setIsMainDomain(true);
        setSubdomain(null);
      }
    }
  }, []);

  return { subdomain, isMainDomain };
};
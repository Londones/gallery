
// Input validation utilities for security
export const validateArtworkTitle = (title: string): { isValid: boolean; error?: string } => {
  if (!title || title.trim().length === 0) {
    return { isValid: false, error: "Title is required" };
  }
  
  if (title.length > 100) {
    return { isValid: false, error: "Title must be less than 100 characters" };
  }
  
  // Basic XSS prevention - reject if contains script tags or javascript
  const dangerousPatterns = /<script|javascript:|data:text\/html|vbscript:|onload|onerror/i;
  if (dangerousPatterns.test(title)) {
    return { isValid: false, error: "Title contains invalid content" };
  }
  
  return { isValid: true };
};

export const validateArtworkDescription = (description: string): { isValid: boolean; error?: string } => {
  if (description && description.length > 1000) {
    return { isValid: false, error: "Description must be less than 1000 characters" };
  }
  
  // Basic XSS prevention
  const dangerousPatterns = /<script|javascript:|data:text\/html|vbscript:|onload|onerror/i;
  if (description && dangerousPatterns.test(description)) {
    return { isValid: false, error: "Description contains invalid content" };
  }
  
  return { isValid: true };
};

export const validatePlatformLink = (url: string): { isValid: boolean; error?: string } => {
  if (!url || url.trim().length === 0) {
    return { isValid: true }; // Optional field
  }
  
  try {
    const urlObj = new URL(url);
    
    // Only allow HTTPS URLs for security
    if (urlObj.protocol !== 'https:') {
      return { isValid: false, error: "Platform links must use HTTPS" };
    }
    
    // Whitelist of allowed domains for platform links
    const allowedDomains = [
      'instagram.com',
      'www.instagram.com',
      'twitter.com',
      'www.twitter.com',
      'x.com',
      'www.x.com',
      'artstation.com',
      'www.artstation.com',
      'deviantart.com',
      'www.deviantart.com',
      'behance.net',
      'www.behance.net',
      'dribbble.com',
      'www.dribbble.com'
    ];
    
    if (!allowedDomains.includes(urlObj.hostname)) {
      return { isValid: false, error: "Platform link must be from a supported platform" };
    }
    
    return { isValid: true };
  } catch {
    return { isValid: false, error: "Please enter a valid URL" };
  }
};

export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    return { isValid: false, error: "Image must be smaller than 5MB" };
  }
  
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: "Only JPEG, PNG, WebP, and GIF images are allowed" };
  }
  
  // Check file extension as additional security
  const fileName = file.name.toLowerCase();
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
  
  if (!hasValidExtension) {
    return { isValid: false, error: "File must have a valid image extension" };
  }
  
  return { isValid: true };
};

// Sanitize text input to prevent XSS
export const sanitizeText = (text: string): string => {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

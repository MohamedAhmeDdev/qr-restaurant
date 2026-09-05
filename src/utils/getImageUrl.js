export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // Return immediately if it is already a complete URL or Blob URL
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('blob:')) {
    return imagePath;
  }

  const baseURL = import.meta.env.VITE_API_URL || '';
  
  // Clean trailing slash from base and leading slash from path
  const cleanBase = baseURL.replace(/\/+$/, '');
  const cleanPath = imagePath.replace(/^\/+/, '');

  return `${cleanBase}/${cleanPath}`;
};
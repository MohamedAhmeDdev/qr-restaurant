// Add this helper function outside your component
export  const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  const baseURL = import.meta.env.VITE_API_URL;
  // Handle if image already has full URL
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  return `${baseURL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};
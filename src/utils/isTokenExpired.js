// src/utils/isTokenExpired.js
export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return true;
    
    // Convert Base64Url to Base64 (handles URL-safe characters '-' and '_')
    const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const decodedPayload = JSON.parse(jsonPayload);
    if (!decodedPayload.exp) return false;
    
    return decodedPayload.exp * 1000 < Date.now();
  } catch (error) {
    return true; 
  }
};
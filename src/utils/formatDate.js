/**
 * Formats an ISO date string into a localized readable date format.
 * @param {string|Date} dateString - The raw date string or Date object.
 * @param {Object} [options] - Optional Intl.DateTimeFormat options to override defaults.
 * @returns {string|null} Formatted date string, or null if input is empty/invalid.
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return null;

  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };

  try {
    return new Date(dateString).toLocaleDateString(undefined, defaultOptions);
  } catch (error) {
    console.error('Invalid date passed to formatDate:', dateString);
    return null;
  }
};
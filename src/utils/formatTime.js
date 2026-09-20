/**
 * Formats an ISO date string or Date object into a localized readable time format.
 * @param {string|Date} dateString - The raw date string or Date object.
 * @param {Object} [options] - Optional Intl.DateTimeFormat options to override defaults.
 * @returns {string|null} Formatted time string, or null if input is empty/invalid.
 */
export const formatTime = (dateString, options = {}) => {
  if (!dateString) return null;

  const defaultOptions = {
    hour: 'numeric',
    minute: '2-digit',
    ...options
  };

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid Date');
    }
    return date.toLocaleTimeString(undefined, defaultOptions);
  } catch (error) {
    console.error('Invalid date passed to formatTime:', dateString);
    return null;
  }
};
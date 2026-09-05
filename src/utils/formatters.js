/**
 * Formats a numeric price into a localized currency string or 'Free'.
 * 
 * @param {number|string} price - The price value to format.
 * @param {Object} [options]
 * @param {string} [options.currency='USD'] - ISO 4217 currency code (e.g., 'KES', 'USD', 'EUR').
 * @param {string} [options.freeText='Free'] - Text display when price is 0 or invalid.
 * @returns {string} Formatted price string.
 */
export const formatPrice = (price, options = {}) => {
  const {
    currency = 'USD',
    freeText = 'Free',
  } = options;

  const numericPrice = parseFloat(price);

  if (isNaN(numericPrice) || numericPrice <= 0) {
    return freeText;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericPrice);
};
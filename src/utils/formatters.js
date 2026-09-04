/**
 * Formats a numeric price into a currency string or 'Free'.
 * 
 * @param {number|string} price - The price value to format.
 * @param {Object} options - Optional configuration settings.
 * @param {string} [options.currencySymbol='$'] - Symbol to prepend (e.g., '$', '€', '£').
 * @param {boolean} [options.showPlus=false] - Whether to include '+' for non-zero prices.
 * @param {string} [options.freeText='Free'] - Text display for $0.00 prices.
 * @returns {string} Formatted price string.
 */
export const formatPrice = (price, options = {}) => {
  const {
    currencySymbol = '$',
    showPlus = false, // Changed default to false
    freeText = 'Free',
  } = options;

  const numericPrice = parseFloat(price);

  if (isNaN(numericPrice) || numericPrice <= 0) {
    return freeText;
  }

  const prefix = showPlus ? '+' : '';
  return `${prefix}${currencySymbol}${numericPrice.toFixed(2)}`;
};
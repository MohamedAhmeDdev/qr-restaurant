// src/hooks/useFormatPrice.js
import { useCallback } from 'react';
import { useRestaurant } from '../contexts/RestaurantContext';
import { formatPrice } from '../utils/formatters';

/**
 * Custom hook to format prices automatically using the active restaurant's currency.
 * 
 * @returns {function(number|string, Object=): string}
 */
export const useFormatPrice = () => {
  const { activeRestaurant } = useRestaurant();

  const format = useCallback(
    (price, options = {}) => {
      return formatPrice(price, {
        currency: activeRestaurant?.currency || 'USD',
        ...options,
      });
    },
    [activeRestaurant?.currency]
  );

  return format;
};
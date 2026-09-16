import { useCallback } from 'react';
import { useRestaurant } from '../contexts/RestaurantContext';
import { formatPrice } from '../utils/formatters';

export const useFormatPrice = () => {
  const { activeRestaurant } = useRestaurant();
  const currency = activeRestaurant?.currency;

  const format = useCallback(
    (price, options = {}) => {
      return formatPrice(price, {
        currency,
        ...options,
      });
    },
    [currency]
  );

  // Return both the formatter function AND the raw currency code
  return {
    formatPrice: format,
    currency,
  };
};
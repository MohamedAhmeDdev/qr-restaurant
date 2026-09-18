import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import RestaurantCurrencyService from '../services/RestaurantCurrencyService';


// Module-level cache to prevent duplicate requests across components
const currencyCache = {};

export const useFormatPrice = () => {
  const { restaurantSlug: urlSlug } = useParams();
  const [currency, setCurrency] = useState('KES');

  useEffect(() => {
    let slug = localStorage.getItem('active_restaurant_slug') || urlSlug;

    if (!slug) return;

    // Use cached currency if available
    if (currencyCache[slug]) {
      setCurrency(currencyCache[slug]);
      return;
    }

    let isMounted = true;

    RestaurantCurrencyService.getCurrency(slug).then((fetchedCurrency) => {
      if (isMounted) {
        currencyCache[slug] = fetchedCurrency;
        setCurrency(fetchedCurrency);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [urlSlug]);

  const formatPrice = useCallback(
    (price, options = {}) => {
      const { freeText = 'Free', locale = undefined } = options;
      const numericPrice = parseFloat(price);

      if (isNaN(numericPrice) || numericPrice <= 0) {
        return freeText;
      }

      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(numericPrice);
    },
    [currency]
  );

  return { formatPrice, currency };
};
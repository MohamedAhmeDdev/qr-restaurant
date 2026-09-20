import guestApi from './guestApi';

export const RestaurantCurrencyService = {
  /**
   * Fetch currency setting for a specific restaurant slug.
   * @param {string} slug
   * @returns {Promise<string>}
   */
  async getCurrency(slug) {
    try {
      const response = await guestApi.get(`/guest/restaurant/${slug}/currency`);
      return response.data?.data?.currency;

      
    } catch (error) {
      console.error(`Failed to fetch currency for ${slug}:`, error);
      return 'KES'; // Fallback
    }
  },
};

export default RestaurantCurrencyService;
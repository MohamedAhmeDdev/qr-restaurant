import api from "./api";

/**
 * Service for handling restaurant-related API requests.
 */
export const RestaurantService = {
  /**
   * Fetch all restaurants for the authenticated user.
   * Target endpoint: GET /restaurants
   * 
   * @param {Object} [params] - Optional query parameters
   * @returns {Promise<Array<{id: number, name: string, slug: string}>>}
   */
  async getRestaurants(params = {}) {
    try {
      const response = await api.get('/restaurants', { params });    
      return response.data?.data;
    } catch (error) {
      console.error('Failed to fetch restaurants:', error);
      throw error;
    }
  }
};



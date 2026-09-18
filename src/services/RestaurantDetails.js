import axios from "axios";
import { Url } from "../utils/ServerUrl";

export const RestaurantService = {
  /**
   * Fetch restaurant details by slug.
   * @param {string} restaurantSlug
   * @returns {Promise<Object>}
   */
  getRestaurantDetails: async (restaurantSlug) => {
    try {
      const response = await axios.get(`${Url}/api/guest/restaurant/${restaurantSlug}`);
      return response.data?.data; 
    } catch (error) {
     console.error("Failed to fetch categories:", error);
      throw error;
    }
  },
};

export default RestaurantService;
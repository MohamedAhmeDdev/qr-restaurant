import api from "./api";

/**
 * Service for handling Modifier Group API requests.
 */
export const ModifiersService = {
  /**
   * Fetch modifier groups with options for a given restaurant.
   * @param {Object} [params] - Query parameters (e.g., { restaurant_id: 1 })
   * @returns {Promise<Array<{id: number, name: string, is_required: boolean, min_select: number, max_select: number, options: Array}>>}
   */
  async getModifierGroups(params = {}) {
    try {
      const response = await api.get("public/modifier-groups", { params });
      
      // Extracts the array from the standard Laravel response format: { status: 'success', data: [...] }
      return response.data?.data ?? [];
    } catch (error) {
      console.error("Failed to fetch modifier groups:", error);
      throw error;
    }
  },
};

export default ModifiersService;
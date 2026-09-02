import api from "./api";

/**
 * Service for handling Category-related API requests.
 */
export const CategoriesService = {
  /**
   * Fetch categories from the public endpoint.
   * @returns {Promise<Array<{id: number, name: string, slug?: string}>>}
   */
  async getCategories() {
    try {
      const response = await api.get("public/categories");
      console.log(response);
   
      return response.data?.data || response.data || [];

      
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      throw error;
    }
  },
};

export default CategoriesService;
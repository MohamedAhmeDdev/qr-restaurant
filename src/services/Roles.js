import api from "./api";

/**
 * Service for handling Role-related API requests.
 */
export const RoleService = {
  /**
   * Fetch all roles for dropdowns and filters.
   * Target endpoint: GET /roles or GET /roles/options
   * 
   * @returns {Promise<Array<{id: number, name: string, slug: string}>>}
   */
  async getRoles() {
    try {
      const response = await api.get('/roles/options');
      // Axios automatically parses response data; adjust if endpoint nests data inside response.data.data
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error('Failed to fetch roles:', error);
      throw error;
    }
  },
};

export default RoleService;
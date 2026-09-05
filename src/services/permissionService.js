import api from "./api";

/**
 * Service for handling Permission-related API requests.
 */
export const permissionService = {
  /**
   * Fetch all distinct permission group names.
   * Target endpoint: GET /permission/group
   * 
   * @returns {Promise<Array<string>>} List of group names
   */
  async getGroups() {
    try {
      const response = await api.get('/permissions/group');
      return response.data?.data;
    } catch (error) {
      throw error;
    }
  },

};

export default permissionService;
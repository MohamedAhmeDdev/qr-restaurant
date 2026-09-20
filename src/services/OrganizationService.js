import api from "./api";

/**
 * Service for handling Organization-related API requests.
 */
export const OrganizationService = {
  /**
   * Fetch organization from the public endpoint.
   * @returns {Promise<Array<{id: number, name: string, slug?: string}>>}
   */
  async getOrganizations() {
    try {
      const response = await api.get("/organization/me");
      return response.data?.data;      
    } catch (error) {
      console.error("Failed to fetch organizations:", error);
      throw error;
    }
  },
};

export default OrganizationService;
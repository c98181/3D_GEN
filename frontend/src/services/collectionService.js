import { apiUtils } from '../utils/apiUtils';

export const collectionService = {
  async listCollections(page = 1) {
    try {
      const response = await apiUtils.get('/trelli_platform/php_backend/api/collections/list.php');
      console.log('Collections list response:', response);
      return response;
    } catch (error) {
      console.error('Collections list error:', error);
      throw error;
    }
  },

  async removeCollection(collectionId) {
    try {
      const response = await apiUtils.post('/trelli_platform/php_backend/api/collections/remove.php', {
        collection_id: collectionId
      });
      return response;
    } catch (error) {
      console.error('Collection removal error:', error);
      throw error;
    }
  },

  async addToCollection(generationId) {
    try {
      const response = await apiUtils.post('/trelli_platform/php_backend/api/collections/add.php', {
        generation_id: generationId
      });
      return response;
    } catch (error) {
      console.error('Add to collection error:', error);
      throw error;
    }
  }
};
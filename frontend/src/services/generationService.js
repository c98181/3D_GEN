import { apiUtils } from '../utils/apiUtils';

export const generationService = {
  async createGeneration(inputText) {
    try {
      const response = await apiUtils.post('/trelli_platform/php_backend/api/generations/create.php', {
        input_text: inputText
      });
      console.log('Generation response:', response);
      return response;
    } catch (error) {
      console.error('Generation creation error:', error);
      throw error;
    }
  },

  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/trelli_platform/php_backend/api/generations/upload_3d.php', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      console.log('Upload response:', response);
      if (!response.ok) {
        throw new Error('Upload failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  }
};
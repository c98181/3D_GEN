import { apiUtils } from '../utils/apiUtils';

export const authService = {
  async login(username, password) {
    try {
      const response = await fetch('/trelli_platform/php_backend/auth/login.php', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
  
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  async register(username, password) {
    try {
      const response = await fetch('/trelli_platform/php_backend/auth/register.php', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });
  
      const data = await response.json();
  
      // 打印完整响应以调试
      console.log('Register response:', response.status, data);
  
      // 直接返回 data，不再做额外处理
      return data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  async logout() {
    try {
      const response = await apiUtils.post('/trelli_platform/php_backend/auth/logout.php');
      return response;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  async getUserProfile() {
    try {
      const response = await apiUtils.get('/trelli_platform/php_backend/api/generations/list.php');
      return {
        success: true,
        username: response.data.username,
        totalGenerations: response.data.total_count || 0
      };
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }
  }
};

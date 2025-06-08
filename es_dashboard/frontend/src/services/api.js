import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service methods
export const apiService = {
  // Health check
  checkHealth: async () => {
    console.log('=== CALLING HEALTH CHECK API ===');
    try {
      const response = await api.get('/health');
      console.log('Health check response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },

  // Create sample data
  createSampleData: async () => {
    console.log('=== CALLING CREATE SAMPLE DATA API ===');
    try {
      const response = await api.post('/create-sample-data');
      console.log('Sample data creation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Sample data creation failed:', error);
      throw error;
    }
  },

  // Get dashboard summary
  getDashboardSummary: async () => {
    console.log('=== CALLING DASHBOARD SUMMARY API ===');
    try {
      const response = await api.get('/dashboard/summary');
      console.log('Dashboard summary response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Dashboard summary fetch failed:', error);
      throw error;
    }
  },

  // Get recent sales
  getRecentSales: async (limit = 10) => {
    console.log(`=== CALLING RECENT SALES API (limit: ${limit}) ===`);
    try {
      const response = await api.get(`/sales/recent?limit=${limit}`);
      console.log('Recent sales response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Recent sales fetch failed:', error);
      throw error;
    }
  },

  // Search data
  searchData: async (query) => {
    console.log(`=== CALLING SEARCH API (query: "${query}") ===`);
    try {
      const response = await api.post('/search', { query });
      console.log('Search response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Search failed:', error);
      throw error;
    }
  },
};

export default apiService;
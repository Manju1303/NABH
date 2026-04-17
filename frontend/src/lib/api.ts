import axios from 'axios';

let API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '');

// Warn if using development default
if (typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_API_URL) {
  console.warn(
    '⚠️  NEXT_PUBLIC_API_URL environment variable not set. Using default: http://localhost:8000\n' +
    'For production, set NEXT_PUBLIC_API_URL in your deployment platform (Vercel, etc.)'
  );
}

// Create a secured axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
});

// Automatically add the token to every request
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('nabh_token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log detailed error info for debugging
    if (error.response?.status === 403) {
      console.error('❌ Access denied. Check your token or permissions.');
    } else if (error.response?.status === 401) {
      console.error('❌ Unauthorized. Please log in again.');
      localStorage.removeItem('nabh_token');
    } else if (error.code === 'ECONNABORTED') {
      console.error('❌ Request timeout. Backend may be unreachable.');
    } else if (!error.response) {
      console.error(`❌ Cannot reach API server: ${API_BASE_URL}`);
      console.error('Check that NEXT_PUBLIC_API_URL is correctly set and the backend is running.');
    }
    return Promise.reject(error);
  }
);

export const getMe = async () => {
    const response = await api.get('/api/users/me');
    return response.data;
};

export { API_BASE_URL };
export default api;

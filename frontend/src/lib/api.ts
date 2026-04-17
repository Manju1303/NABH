import axios from 'axios';

let API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '');

console.log(`[HealthGuard API] Targeting: ${API_BASE_URL}`);

// Create a secured axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Automatically add the token to every request
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('nabh_token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getMe = async () => {
    const response = await api.get('/api/users/me');
    return response.data;
};

export { API_BASE_URL };
export default api;

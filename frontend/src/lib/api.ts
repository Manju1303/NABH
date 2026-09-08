import axios from 'axios';

// HIGH-10 FIX: Removed hardcoded Render URL fix — use env var correctly
export const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('nabh_custom_api_url');
    if (custom && custom.trim()) return custom.trim().replace(/\/$/, '');
  }
  return (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '');
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Attach Bearer token and dynamic baseURL to every request
api.interceptors.request.use((config) => {
  const currentBase = getApiBaseUrl();
  config.baseURL = currentBase;
  const token = typeof window !== 'undefined' ? localStorage.getItem('nabh_token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401 with refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('nabh_refresh_token') : null;
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}/api/token/refresh`, null, {
            params: { refresh_token: refreshToken },
          });
          const { access_token, refresh_token } = res.data;
          localStorage.setItem('nabh_token', access_token);
          localStorage.setItem('nabh_refresh_token', refresh_token);
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        } catch {
          localStorage.removeItem('nabh_token');
          localStorage.removeItem('nabh_refresh_token');
          if (typeof window !== 'undefined') window.location.href = '/login';
        }
      } else {
        localStorage.removeItem('nabh_token');
        if (typeof window !== 'undefined') window.location.href = '/login';
      }
    }

    if (error.response?.status === 403) {
      console.error('❌ Access denied. Check your role/permissions.');
    } else if (error.code === 'ECONNABORTED') {
      console.error('❌ Request timeout. Backend may be unreachable.');
    } else if (!error.response) {
      console.error(`❌ Cannot reach API: ${API_BASE_URL}`);
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

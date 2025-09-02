import axios from 'axios';

function buildBaseApiUrl() {
  const base = (import.meta.env.VITE_API_URL || 'http://localhost:5000').toString();
  const normalized = base.replace(/\/+$/, '');
  // ensure single /api suffix
  return normalized.endsWith('/api') ? normalized : `${normalized}/api`;
}

const api = axios.create({
  baseURL: buildBaseApiUrl(),
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

// Guard: if we accidentally hit the Vite server, it returns index.html
api.interceptors.response.use((res) => {
  if (typeof res.data === 'string' && res.data.trim().startsWith('<!doctype html')) {
    throw new Error('SPA_HTML_RECEIVED_FROM_API: Check VITE_API_URL or dev proxy.');
  }
  return res;
});

export default api;

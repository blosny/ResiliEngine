import axios from 'axios';

// VITE_API_URL değişkenini Docker veya Render'dan alır
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
});

export const triggerChaos = async (type: 'latency' | 'error500') => {
  const response = await api.post('/chaos/trigger', { type });
  return response.data;
};

export const getHistory = async () => {
  const response = await api.get('/chaos/history');
  return response.data;
};
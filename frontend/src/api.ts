import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const triggerChaos = async (type: 'latency' | 'error500') => {
  const response = await api.post('/chaos/trigger', { type });
  return response.data;
};

export const getHistory = async () => {
  const response = await api.get('/chaos/history');
  return response.data;
};
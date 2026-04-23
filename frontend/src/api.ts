import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const triggerChaos = async (type: 'latency' | 'error500' | '429' | '401') => {
  const response = await api.post('/chaos/trigger', { type });
  return response.data;
};

export const getHistory = async () => {
  const response = await api.get('/chaos/history');
  return response.data;
};

export const clearHistory = async () => {
  const response = await api.get('/chaos/history/clear');
  return response.data;
};

export const analyzeCustomLog = async (logContent: string) => {
  // AI servisine direkt gitmek için (backend üzerinden de geçebiliriz ama şimdilik direkt olsun)
  // Genelde backend üzerinden geçmek daha güvenlidir.
  const AI_URL = 'http://localhost:8000'; // Default AI Service Port
  const response = await axios.post(`${AI_URL}/analyze`, { log_content: logContent });
  return response.data;
};
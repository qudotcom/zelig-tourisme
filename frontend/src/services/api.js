import axios from 'axios';
const API_URL = 'http://127.0.0.1:8001';

export const chatWithGuide = async (query) => {
  try { return (await axios.post(`${API_URL}/api/chat`, { query })).data.response; }
  catch (e) { return "Zelig is offline."; }
};

export const translateText = async (text) => {
  try { return (await axios.post(`${API_URL}/api/translate`, { text })).data.translation; }
  catch (e) { return "Translation failed."; }
};

export const checkCitySecurity = async (city) => {
  try { return (await axios.get(`${API_URL}/api/security/${city}`)).data; }
  catch (e) { return null; }
};
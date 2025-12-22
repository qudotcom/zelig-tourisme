import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

export const chatWithGuide = async (query) => {
  const res = await axios.post(`${API_URL}/chat`, { query });
  return res.data.response;
};

export const translateText = async (text, target) => {
  const res = await axios.post(`${API_URL}/translate`, { text, target });
  return res.data.translation;
};

export const checkSecurity = async (location) => {
  const res = await axios.post(`${API_URL}/security`, { location });
  return res.data;
};

export const getFeed = async () => {
  const res = await axios.get(`${API_URL}/social`);
  return res.data;
};

export const postMoment = async (data) => {
  const res = await axios.post(`${API_URL}/social`, data);
  return res.data;
};

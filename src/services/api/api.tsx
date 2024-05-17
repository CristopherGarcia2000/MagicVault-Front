import axios from 'axios';

const API_BASE_URL = 'https://localhost:8080.com'; 

export const fetchTypes = async () => {
  const response = await axios.get(`${API_BASE_URL}/creature-types`);
  return response.data;
};

export const fetchExpansions = async () => {
  const response = await axios.get(`${API_BASE_URL}/sets`);
  return response.data;
};

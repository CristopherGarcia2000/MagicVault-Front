import axios, { AxiosResponse } from 'axios';
import { Card } from '../../types/cardType';

const API_BASE_URL = 'http://localhost:8081'; 

export const fetchTypes = async () => {
  const response = await axios.get(`${API_BASE_URL}/creature-types`);
  return response.data;
};

export const fetchExpansions = async () => {
  const response = await axios.get(`${API_BASE_URL}/sets`);
  return response.data;
};

export const fetchRandomCommander = async () => {
  try {
    const response = await fetch('http://88.8.106.169:8185/random-commander');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

import axios, { AxiosResponse } from 'axios';
import { Card } from '../../types/cardsType';

const API_BASE_URL = 'http://192.168.1.38:8082'; 

export const fetchTypes = async () => {
  const response = await axios.get(`${API_BASE_URL}/creature-types`);
  return response.data;
};

export const fetchExpansions = async () => {
  const response = await axios.get(`${API_BASE_URL}/sets`);
  return response.data;
};

export const fetchRandomCommander = async (): Promise<Card> => {
  try {
    const response = await axios.get<Card>(`${API_BASE_URL}/random-commander`);
    return response.data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

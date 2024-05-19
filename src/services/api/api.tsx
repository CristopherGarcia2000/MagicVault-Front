import axios, { AxiosResponse } from 'axios';
import { Card } from '../../types/cardsType';

const API_BASE_URL = 'http://192.168.1.42:8082'; 

export const fetchExpansions = async () => {
  try {
    const response: AxiosResponse<{ data: { name: string, code: string }[] }> = await axios.get(`${API_BASE_URL}/sets`);
    return response.data.data.map(expansion => ({ label: expansion.name, value: expansion.code }));
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
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

export const searchCards = async (filter: CardSearchFilter): Promise<{ data: Card[] }> => {
  try {
    const response: AxiosResponse<{ data: Card[] }> = await axios.post(`${API_BASE_URL}/search-cards`, filter);
    return response.data;
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
};

export interface CardSearchFilter {
  colors?: string[];
  type?: string;
  expansion?: string;
  name?: string;
}

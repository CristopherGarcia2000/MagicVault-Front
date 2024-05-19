import axios, { AxiosResponse } from 'axios';
import { Card } from '../types/cardType';

export const fetchRandomCommander = async (): Promise<Card> => {
  try {
    const response: AxiosResponse<Card> = await axios.get('https://api.scryfall.com/cards/random?q=is%3Acommander');
    return response.data;
  } catch (error) {
    console.error('Error fetching commander:', error);
    throw error;
  }
};

export { Card };


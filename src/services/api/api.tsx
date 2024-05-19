import axios, { AxiosResponse } from 'axios';
import { Card } from '../../types/cardsType';
import  AsyncStorage  from '@react-native-async-storage/async-storage';
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
  
export const registerUser = async (username: string, email: string, pass: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      username,
      pass,
      email,
    });
    
    if (response.status === 200) {
      const token = response.data.token; 
      await AsyncStorage.setItem('loginToken', token);
      return token;
    } else if (response.status === 400) {
      throw new Error('El nombre de usuario ya está en uso');
    } else {
      throw new Error('Error al registrar');
    }
  } catch (error) {
    throw new Error('Error al conectar con el servidor');
  }
};
export const getUser = async (username: string , pass: string) => {
  try {
    const token = await AsyncStorage.getItem('loginToken');
    if (!token) {
      throw new Error('Token no encontrado');
    }

    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      username , 
      pass,
      headers: { Authorization: `Bearer ${token}` }, 
    });

    if (response.status === 200) {
      await AsyncStorage.setItem('userData', JSON.stringify(response.data));
      return response.data;
    } else {
      throw new Error('Error al obtener datos del usuario');
    }
  } catch (error) {
    throw new Error('Error al conectar con el servidor');
  }
};

export const loginUser = async (username:string,password:string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      username,
      password,
    });
    
    if (response.status === 200) {
      const token = response.data.token;
      await AsyncStorage.setItem('loginToken', token);
      return token;
    } else {
      throw new Error('Error al iniciar sesión');
    }
  } catch (error) {
    throw new Error('Error al conectar con el servidor');
  }
}
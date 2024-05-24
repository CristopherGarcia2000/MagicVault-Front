import axios, { AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Collection } from '../../types/collectionsTypes';
import { Card } from '../../types/cardsType';
import { Deck } from '../../types/decksTypes';

const API_BASE_URL = 'http://192.168.1.42:8082';

// Fetch expansions from the server
export const fetchExpansions = async () => {
  try {
    const response: AxiosResponse<{ data: { name: string, code: string }[] }> = await axios.get(`${API_BASE_URL}/sets`);
    return response.data.data.map(expansion => ({ label: expansion.name, value: expansion.code }));
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
};

// Fetch a random commander card
export const fetchRandomCommander = async (): Promise<Card> => {
  try {
    const response = await axios.get<Card>(`${API_BASE_URL}/random-commander`);
    return response.data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

// Search for cards based on filters
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

// Register a new user
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

// Fetch user details
export const getUser = async (username: string, pass: string) => {
  try {
    const token = await AsyncStorage.getItem('loginToken');
    if (!token) {
      throw new Error('Token no encontrado');
    }

    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      username,
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

// Log in a user
export const loginUser = async (username: string, password: string) => {
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
};

// Fetch decks from a specific user
export const getDecksFromUser = async (username: string): Promise<Deck[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/decks/user/${username}`);
    return response.data; 
  } catch (error) {
    console.error('Error fetching user decks:', error);
    throw error;
  }
};

// Fetch all decks
export const fetchAllDecks = async (): Promise<Deck[]> => {
  try {
    const response: AxiosResponse<Deck[]> = await axios.get(`${API_BASE_URL}/decks`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all decks:', error);
    throw error;
  }
};

interface AddRemoveCardDeckRequest {
  deckname: string;
  cardName: string;
  user: string;
}

// Add a card to a deck
export const addCardToDeck = async (deckname: string, cardName: string, user: string) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/decks/addCard`, {
      deckname,
      cardName,
      user
    } as AddRemoveCardDeckRequest);
    return response.data;
  } catch (error) {
    console.error('Error adding card to deck:', error);
    throw error;
  }
};

// Fetch collections from a specific user
export const getCollectionsFromUser = async (username:string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/collections/user/${username}`);
    return response.data; 
  } catch (error) {
    console.error('Error fetching user collections:', error);
    throw error;
  }
};

interface AddRemoveCardCollectionRequest {
  collectionname: string;
  cardName: string;
  user: string;
}

// Add a card to a collection
export const addCardToCollections = async (deckname: string, cardName: string, user: string) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/collections/addCard`, {
      deckname,
      cardName,
      user
    } as AddRemoveCardDeckRequest);
    return response.data;
  } catch (error) {
    console.error('Error adding card to collection:', error);
    throw error;
  }
};

// Fetch collections of a user
export const fetchCollections = async (user: string): Promise<Collection[]> => {
  try {
    const response: AxiosResponse<Collection[]> = await axios.get(`${API_BASE_URL}/collections/user/${user}`);
    return response.data;
  } catch (error) {
    console.error('Fetch collections error:', error);
    throw error;
  }
};

// Add a new collection
export const addCollection = async (collection: Collection) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/collections`, collection);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 409) {
      throw new Error('La colección con el mismo nombre ya existe para este usuario');
    } else {
      console.error('Add collection error:', error);
      throw error;
    }
  }
};

interface RemoveCollectionRequest {
  deckname: string;
  user: string;
}

// Delete a collection
export const deleteCollection = async (deckname: string, user: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/collections/delete`, {
      data: { deckname, user } as RemoveCollectionRequest
    });
    return response.data;
  } catch (error) {
    console.error('ERROR:', error);
    throw error;
  }  
};

// Fetch cards from a specific collection
export const fetchCollectionCards = async (user: string, collectionName: string): Promise<Card[]> => {
  try {
    const response: AxiosResponse<Card[]> = await axios.get(`${API_BASE_URL}/collections/cards`, {
      params: { user, collectionName },
    });
    return response.data;
  } catch (error) {
    console.error('Fetch collection cards error:', error);
    throw error;
  }
};

interface CardRemoveCardRequest {
  deckname: string;
  user: string;
  cardName: string;
}

// Remove a card from a collection
export const removeCardFromCollection = async (deckname: string, user: string, cardName: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/collections/removeCard`, {
      data: { deckname, user, cardName } as CardRemoveCardRequest,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error removing card from collection:', error);
    throw error;
  }
};

// Fetch decks from a specific user
export const fetchDecks = async (user: string): Promise<Deck[]> => {
  try {
    const response: AxiosResponse<Deck[]> = await axios.get(`${API_BASE_URL}/decks/user/${user}`);
    return response.data;
  } catch (error) {
    console.error('Fetch decks error:', error);
    throw error;
  }
};

// Add a new deck
export const addDeck = async (deck: Deck) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/decks`, deck);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 409) {
      throw new Error('El mazo con el mismo nombre ya existe para este usuario');
    } else {
      console.error('Add deck error:', error);
      throw error;
    }
  }
};

// Delete a deck
export const deleteDeck = async (deckname: string, user: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/decks/delete`, {
      data: { deckname, user },
    });
    return response.data;
  } catch (error) {
    console.error('Delete deck error:', error);
    throw error;
  }
};

// Fetch cards from a specific deck
export const fetchDeckCards = async (user: string, deckName: string): Promise<Card[]> => {
  try {
    const response: AxiosResponse<Card[]> = await axios.get(`${API_BASE_URL}/decks/cards`, {
      params: { user, deckName },
    });
    return response.data;
  } catch (error) {
    console.error('Fetch deck cards error:', error);
    throw error;
  }
};

// Remove a card from a deck
export const removeCardFromDeck = async (deckname: string, user: string, cardName: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/decks/removeCard`, {
      data: { deckname, user, cardName },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error removing card from deck:', error);
    throw error;
  }
};

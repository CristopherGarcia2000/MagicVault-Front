import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { Card } from '../../types/cardsType'; // Import Card data type

// Define the structure of AuthContext data
interface AuthContextData {
  isAuthenticated: boolean;
  user: any | null;
  login: (user: any, token: string) => void;
  logout: () => void;
  visitedCards: Card[]; // List of recently visited cards
  addVisitedCard: (card: Card) => void; // Function to add a visited card
}

// Create the AuthContext with default values
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Define the AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [visitedCards, setVisitedCards] = useState<Card[]>([]); // State to maintain the list of visited cards

  // Load data from AsyncStorage when the component mounts
  useEffect(() => {
    const loadStorageData = async () => {
      const token = await AsyncStorage.getItem('loginToken');
      const userData = await AsyncStorage.getItem('userData');
      const visitedCardsData = await AsyncStorage.getItem('visitedCards'); // Load visited cards from storage

      if (token && userData) {
        const decodedToken: any = jwtDecode(token);
        const userWithMail = { ...JSON.parse(userData), email: decodedToken.email };
        setUser(userWithMail);
        setIsAuthenticated(true);
      }

      if (visitedCardsData) {
        setVisitedCards(JSON.parse(visitedCardsData)); // Set visited cards from storage
      }
    };
    loadStorageData();
  }, []);

  // Function to handle user login
  const login = async (user: any, token: string) => {
    const decodedToken: any = jwtDecode(token);
    const userWithMail = { ...user, email: decodedToken.email };
    setUser(userWithMail);
    setIsAuthenticated(true);
    await AsyncStorage.setItem('loginToken', token);
    await AsyncStorage.setItem('userData', JSON.stringify(userWithMail));
  };

  // Function to handle user logout
  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
    await AsyncStorage.removeItem('loginToken');
    await AsyncStorage.removeItem('userData');
  };

  // Function to add a visited card
  const addVisitedCard = async (card: Card) => {
    const newVisitedCards = [card, ...visitedCards]; // Add the new card to the beginning of the list
    const limitedVisitedCards = newVisitedCards.slice(0, 6); // Limit the list to the last 6 visited cards

    setVisitedCards(limitedVisitedCards); // Update the state
    await AsyncStorage.setItem('visitedCards', JSON.stringify(limitedVisitedCards)); // Save to storage
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, visitedCards, addVisitedCard }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

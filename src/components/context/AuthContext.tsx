import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import { Card } from '../../types/cardsType'; // Importar el tipo de datos Card

interface AuthContextData {
  isAuthenticated: boolean;
  user: any | null;
  login: (user: any, token: string) => void;
  logout: () => void;
  visitedCards: Card[]; // Lista de cartas visitadas recientemente
  addVisitedCard: (card: Card) => void; // Función para agregar una carta visitada
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [visitedCards, setVisitedCards] = useState<Card[]>([]); // Estado para mantener la lista de cartas visitadas

  useEffect(() => {
    const loadStorageData = async () => {
      const token = await AsyncStorage.getItem('loginToken');
      const userData = await AsyncStorage.getItem('userData');
      const visitedCardsData = await AsyncStorage.getItem('visitedCards'); // Cargar las cartas visitadas del almacenamiento

      if (token && userData) {
        const decodedToken: any = jwtDecode(token);
        const userWithMail = { ...JSON.parse(userData), email: decodedToken.email };
        setUser(userWithMail);
        setIsAuthenticated(true);
      }

      if (visitedCardsData) {
        setVisitedCards(JSON.parse(visitedCardsData)); // Establecer las cartas visitadas desde el almacenamiento
      }
    };
    loadStorageData();
  }, []);

  const login = async (user: any, token: string) => {
    const decodedToken: any = jwtDecode(token);
    const userWithMail = { ...user, email: decodedToken.email };
    setUser(userWithMail);
    setIsAuthenticated(true);
    await AsyncStorage.setItem('loginToken', token);
    await AsyncStorage.setItem('userData', JSON.stringify(userWithMail));
  };

  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
    await AsyncStorage.removeItem('loginToken');
    await AsyncStorage.removeItem('userData');
  };

  // Función para agregar una carta visitada
  const addVisitedCard = async (card: Card) => {
    // Agregar la nueva carta al inicio de la lista
    const newVisitedCards = [card, ...visitedCards];

    // Limitar la lista a las últimas 4 cartas visitadas
    const limitedVisitedCards = newVisitedCards.slice(0, 6);

    // Actualizar el estado y guardar en el almacenamiento
    setVisitedCards(limitedVisitedCards);
    await AsyncStorage.setItem('visitedCards', JSON.stringify(limitedVisitedCards));
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, visitedCards, addVisitedCard }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

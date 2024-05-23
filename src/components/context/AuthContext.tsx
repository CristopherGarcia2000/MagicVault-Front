import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';

interface AuthContextData {
  isAuthenticated: boolean;
  user: any | null;
  login: (user: any, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const loadStorageData = async () => {
      const token = await AsyncStorage.getItem('loginToken');
      const userData = await AsyncStorage.getItem('userData');
      if (token && userData) {
        const decodedToken: any = jwtDecode(token);
        const userWithMail = { ...JSON.parse(userData), email: decodedToken.email };
        setUser(userWithMail);
        setIsAuthenticated(true);
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

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the context for the selected screen with default values
const SelectedScreenContext = createContext({
  selectedScreen: 'Home', // Default screen
  setSelectedScreen: (screen: string) => {} // Default function to update the screen
});

// Define the provider component for the SelectedScreenContext
export const SelectedScreenProvider = ({ children }: { children: ReactNode }) => {
  const [selectedScreen, setSelectedScreen] = useState('Home'); // State to keep track of the selected screen

  return (
    <SelectedScreenContext.Provider value={{ selectedScreen, setSelectedScreen }}>
      {children}
    </SelectedScreenContext.Provider>
  );
};

// Custom hook to use the SelectedScreenContext
export const useSelectedScreen = () => useContext(SelectedScreenContext);

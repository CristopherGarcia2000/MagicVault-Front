import React, { createContext, useState, useContext, ReactNode } from 'react';

const SelectedScreenContext = createContext({
  selectedScreen: 'Home',
  setSelectedScreen: (screen: string) => {}
});

export const SelectedScreenProvider = ({ children }: { children: ReactNode }) => {
  const [selectedScreen, setSelectedScreen] = useState('Home');
  return (
    <SelectedScreenContext.Provider value={{ selectedScreen, setSelectedScreen }}>
      {children}
    </SelectedScreenContext.Provider>
  );
};

export const useSelectedScreen = () => useContext(SelectedScreenContext);

import React from 'react';
import { StyleSheet} from 'react-native';
import AppNavigator from './src/components/appNavigator';
import { AuthProvider } from './src/components/context/AuthContext';

export default function App() {
  
  return (
    <AuthProvider>
      <AppNavigator/>
    </AuthProvider>  
  );
}

const styles = StyleSheet.create({
});

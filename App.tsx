import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../magic-vault-app-front/src/styles/colors';
import AppNavigator from './src/components/appNavigator';

export default function App() {
  
  return (
    <AppNavigator/>
  );
}

const styles = StyleSheet.create({
});

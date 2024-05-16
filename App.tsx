import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppNavigator from './src/components/appNavigator';
import TabNavigation from './src/components/TabNavigation';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  
  return (
      <AppNavigator/>
  );
}

const styles = StyleSheet.create({
});

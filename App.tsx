import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../magic-vault-app-front/src/styles/colors';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/home';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Bienvenido A Magic Vault</Text>
      <StatusBar style="auto" />
    </View>

    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

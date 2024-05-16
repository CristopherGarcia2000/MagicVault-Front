

import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '../styles/colors'

export default function SearchScreen() {
  return (
    <View style={styles.container}>
      <Text>Bienvenido A Search</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.GreyNeutral,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

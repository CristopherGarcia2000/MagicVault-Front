

import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../styles/colors'

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
    backgroundColor: colors.GreyNeutral,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

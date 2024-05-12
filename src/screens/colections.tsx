import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../styles/colors'

export default function CollectionsScreen() {
  return (
    <View style={styles.container}>
      <Text>Bienvenido A Collections</Text>
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

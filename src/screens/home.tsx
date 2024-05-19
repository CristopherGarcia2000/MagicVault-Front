import { StatusBar } from 'expo-status-bar';
import Colors from '../styles/colors'
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { fetchRandomCommander } from '../services/scryfall';
import CardPreview from '../components/cardPreview';

export default function HomeScreen() {

  return (
    <View style={styles.container}>
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

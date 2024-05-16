import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import colors from '../styles/colors'
import { fetchRandomCommander } from '../services/scryfall';

export default function HomeScreen() {
  const [randomCommander, setRandomCommander] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    fetchCommander();
  }, []);

  const fetchCommander = async () => {
    try {
      setLoading(true);
      const commander = await fetchRandomCommander();
      setRandomCommander(commander);
    } catch (error) {
      console.error('Error fetching commander:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRandomCommander = () => {
    fetchCommander();
  };
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : randomCommander ? (
        <>
          <Text>{randomCommander.name}</Text>
          <Button title="Generar otro commander" onPress={handleGenerateRandomCommander} />
        </>
      ) : (
        <Text>No se encontraron datos.</Text>
      )}
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

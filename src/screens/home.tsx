import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, Image, StyleSheet, Text, View } from 'react-native';
import { fetchRandomCommander } from '../services/api/api';
import { Card } from '../types/cardsType';
import colors from '../styles/colors';

export default function HomeScreen() {
  const [randomCommander, setRandomCommander] = useState<Card | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchCommander();
  }, []);

  const fetchCommander = async () => {
    try {
      setLoading(true);
      const commander: Card = await fetchRandomCommander();
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
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text>{randomCommander?.name}</Text>
          {randomCommander?.image_uris?.png ? (
            <Image
              source={{ uri: randomCommander.image_uris.png }}
              style={{ width: 300, height: 300, resizeMode: 'contain' }}
            />
          ) : (
            <Text>No hay imagen disponible para este comandante.</Text>
          )}
          <Button title="Generar otro commander" onPress={handleGenerateRandomCommander} />
        </>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.GreyNeutral,
    padding: 16,
    justifyContent: 'center', 
    alignItems: 'center'
  }
});
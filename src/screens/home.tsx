import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, Image, Pressable, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native';
import { fetchRandomCommander } from '../services/api/api';
import { Card } from '../types/cardsType';
import colors from '../styles/colors';
import CardPreview from '../components/cardPreview';

export default function HomeScreen() {
  const [randomCommander, setRandomCommander] = useState<Card | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCardPreviewVisible,setIsCardPreviewVisible] = useState<boolean>(false);

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
  const handleImagePress = () => {
    setIsCardPreviewVisible(true);
  }
  const handleCloseCardPreview = () => {
    setIsCardPreviewVisible(false);
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text>{randomCommander?.name}</Text>
          {randomCommander?.image_uris?.png ? (
          <TouchableOpacity onPress={handleImagePress}>
           <Image
             source={{ uri: randomCommander?.image_uris?.png }}
             style={{ width: 300, height: 300, resizeMode: 'contain' }}
           />
         </TouchableOpacity>
          ) : (
            <Text>No hay imagen disponible para este comandante.</Text>
          )}
          <Button title="Generar otro commander" onPress={handleGenerateRandomCommander} />
        </>
      )}
      <CardPreview 
        visible={isCardPreviewVisible}
        onClose={handleCloseCardPreview}
        card={randomCommander}
      />
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
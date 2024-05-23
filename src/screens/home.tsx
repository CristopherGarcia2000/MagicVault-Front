import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, FlatList } from 'react-native';
import { fetchRandomCommander } from '../services/api/api';
import { Card } from '../types/cardsType';
import colors from '../styles/colors';
import CardPreview from '../components/cardPreview';
import { useAuth } from '../components/context/AuthContext'; // Importar el contexto de autenticación

export default function HomeScreen() {
  const { visitedCards } = useAuth(); // Obtener la lista de cartas visitadas desde el contexto
  const [randomCommander, setRandomCommander] = useState<Card | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCardPreviewVisible, setIsCardPreviewVisible] = useState<boolean>(false);

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
  };

  const handleCloseCardPreview = () => {
    setIsCardPreviewVisible(false);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text style={styles.visitedCardsTitle}>Últimas cartas visitadas:</Text>
    <FlatList
      horizontal
      data={visitedCards}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => console.log(item)}>
          <Image 
            source={{ uri: item.image_uris?.png }} 
            style={styles.visitedCardImage} 
          />
        </TouchableOpacity>
      )}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.flatListContainer}
    />
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
      {visitedCards.length > 0 && (
  <View style={styles.visitedCardsContainer}>
    
  </View>
)}
      <CardPreview
        visible={isCardPreviewVisible}
        onClose={handleCloseCardPreview}
        card={{
          ...randomCommander,
          power: randomCommander?.power?.toString(),
          toughness: randomCommander?.toughness?.toString(),
        }}
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
    alignItems: 'center',
  },
  visitedCardsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  visitedCardsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  visitedCardImage: {
    width: 100,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  scrollViewContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  flatListContainer: {
    paddingVertical: 5,
  },
});

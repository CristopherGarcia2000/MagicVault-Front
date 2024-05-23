import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, Image, StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import { fetchRandomCommander } from '../services/api/api';
import { Card } from '../types/cardsType';
import colors from '../styles/colors';
import CardPreview from '../components/cardPreview';
import { useAuth } from '../components/context/AuthContext';
import Colors from '../styles/colors';

export default function HomeScreen() {
  const { visitedCards } = useAuth();
  const [randomCommander, setRandomCommander] = useState<Card | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCardPreviewVisible, setIsCardPreviewVisible] = useState<boolean>(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

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

  const handleImagePress = (card: Card) => {
    setSelectedCard(card);
    setIsCardPreviewVisible(true);
  };

  const handleCloseCardPreview = () => {
    setIsCardPreviewVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.title}>Comandante Aleatorio</Text>
        {loading ? (
          <ActivityIndicator size="large" color={colors.Gold} />
        ) : (
          <>
            {randomCommander?.image_uris?.png ? (
              <TouchableOpacity onPress={() => handleImagePress(randomCommander)}>
                <Image
                  source={{ uri: randomCommander?.image_uris?.png }}
                  style={styles.commanderImage}
                />
              </TouchableOpacity>
            ) : (
              <Text style={styles.noImageText}>No hay imagen disponible para este comandante.</Text>
            )}
          </>
        )}
        <TouchableOpacity
        style = {styles.buttonGenerate}
        onPress={handleGenerateRandomCommander}>
          <Text style={styles.buttonGenerateText}>Generar Otro Comandante</Text>
          </TouchableOpacity>
        
      </View>

      <View style={styles.bottomContainer}>
        {visitedCards.length > 0 && (
          <View style={styles.visitedCardsContainer}>
            <Text style={styles.visitedCardsTitle}>Últimas cartas visitadas:</Text>
            <FlatList
              horizontal
              data={visitedCards}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleImagePress(item)}>
                  <Image 
                    source={{ uri: item.image_uris?.png }} 
                    style={styles.visitedCardImage} 
                  />
                </TouchableOpacity>
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.flatListContainer}
            />
          </View>
        )}
      </View>

      {selectedCard && (
        <CardPreview
          visible={isCardPreviewVisible}
          onClose={handleCloseCardPreview}
          card={{
            ...selectedCard,
            power: selectedCard.power?.toString(),
            toughness: selectedCard.toughness?.toString(),
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.GreyNeutral,
    padding: 16,
    justifyContent: 'space-between',
    alignItems:'center'
  },
  topContainer: {
    alignItems: 'center',
    marginBottom:10
  },
  buttonGenerate:{
    position:'absolute',
    top:350,
    backgroundColor: Colors.Gold,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 16,
    padding:10
    },
    buttonGenerateText:{
      color: '#333',
      fontSize: 16,
      fontWeight: 'bold',
    },
  bottomContainer: {
    top:430,
    position:'absolute',
    alignItems: 'center',
    width:330,
    justifyContent:'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.Gold,
    marginBottom: 20,
    textAlign: 'center',
  },
  commanderImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  noImageText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    justifyContent:'center'
  },
  visitedCardsContainer: {
    padding:16,
    marginTop: 20,
    alignItems: 'center',
    justifyContent:'center',
    backgroundColor:colors.GreyDark,
    borderRadius:15,
    width:360
  },
  visitedCardsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.Gold,
    marginBottom: 10,
    textAlign: 'center',
  },
  visitedCardImage: {
    width: 100,
    height: 150,
    resizeMode: 'contain',
    marginHorizontal: 5,
  },
  flatListContainer: {
    paddingVertical: 5,
  },
});

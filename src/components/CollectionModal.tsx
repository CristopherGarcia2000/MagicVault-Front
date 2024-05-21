import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import Colors from '../styles/colors';
import { fetchCollectionCards } from '../services/api/api';
import { Card } from '../types/cardsType';
import CardPreview from '../components/cardPreview';

interface CollectionModalProps {
  visible: boolean;
  onClose: () => void;
  collectionName: string;
  user: string;
}

const CollectionModal: React.FC<CollectionModalProps> = ({ visible, onClose, collectionName, user }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [cardName, setCardName] = useState<string>('');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);

  useEffect(() => {
    const loadCards = async () => {
      setLoading(true);
      try {
        const fetchedCards = await fetchCollectionCards(user, collectionName);
        setCards(fetchedCards);
      } catch (error) {
        console.error('Error fetching cards:', error);
      } finally {
        setLoading(false);
      }
    };

    if (visible) {
      loadCards();
    }
  }, [visible, collectionName, user]);

  const filterCardsByName = (name: string) => {
    if (!name) return cards;
    return cards.filter((card) =>
      card.name?.includes(name)
    );
  };

  const renderItem = (item: Card) => (
    <TouchableOpacity key={item.name} style={styles.card} onPress={() => { setSelectedCard(item); setPreviewVisible(true); }}>
      <Image source={{ uri: item.image_uris?.png }} style={styles.cardImage} />
      <Text style={styles.cardName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal isVisible={visible} onBackdropPress={onClose}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Cartas en {collectionName}</Text>
        <TextInput
          style={styles.searchBar}
          placeholder="Buscar Cartas..."
          placeholderTextColor="#777"
          onChangeText={setCardName}
          value={cardName}
        />
        {loading ? (
          <ActivityIndicator size="large" color={Colors.Gold} />
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.cardsContainer}>
              {filterCardsByName(cardName).map(renderItem)}
            </View>
          </ScrollView>
        )}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Cerrar</Text>
        </TouchableOpacity>
      </View>
      {selectedCard && (
        <CardPreview
          visible={previewVisible}
          onClose={() => setPreviewVisible(false)}
          card={{
      ...selectedCard,
      power: selectedCard.power?.toString(),
      toughness: selectedCard.toughness?.toString(),
    }}
        />
      )}
    </Modal>
  );
};


const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: Colors.GreyNeutral,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    maxHeight: '80%',
  },
  modalTitle: {
    color: Colors.Gold,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchBar: {
    height: 40,
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#fff',
    marginBottom: 16,
    width: '100%',
  },
  scrollContainer: {
    width: '100%',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    height: 190,
    width: 100,
    padding: 5,
    marginVertical: 5,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  cardImage: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
  },
  cardName: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 5,
  },
  cardPrice: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.Gold,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CollectionModal;

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../styles/colors';
import { fetchDeckCards, removeCardFromDeck, searchCards } from '../services/api/api';
import { Card } from '../types/cardsType';
import CardPreview from './cardPreview';

// Define the props for the DeckModal component
interface DeckModalProps {
  visible: boolean;
  onClose: () => void;
  deckName: string;
  commander: string; // Name of the commander
  user: string;
  isUserDeck: boolean; // New property to check if the deck belongs to the user
}

// DeckModal component to display and manage a deck of cards
const DeckModal: React.FC<DeckModalProps> = ({ visible, onClose, deckName, commander, user, isUserDeck }) => {
  const [cards, setCards] = useState<Card[]>([]); // State to store the cards in the deck
  const [loading, setLoading] = useState<boolean>(true); // State to manage the loading indicator
  const [cardName, setCardName] = useState<string>(''); // State to manage the search input value
  const [selectedCard, setSelectedCard] = useState<Card | null>(null); // State to manage the selected card for preview
  const [previewVisible, setPreviewVisible] = useState<boolean>(false); // State to control card preview modal visibility
  const [confirmVisible, setConfirmVisible] = useState<boolean>(false); // State to control confirmation modal visibility
  const [cardToRemove, setCardToRemove] = useState<string | null>(null); // State to store the card name to be removed
  const [commanderCard, setCommanderCard] = useState<Card | null>(null); // State to store the commander card details

  useEffect(() => {
    // Function to load the cards in the deck
    const loadCards = async () => {
      setLoading(true);
      try {
        const fetchedCards = await fetchDeckCards(user, deckName);
        setCards(fetchedCards); // Update the cards state with fetched cards
      } catch (error) {
        console.error('Error fetching cards:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching cards
      }
    };

    // Function to load the commander card details
    const loadCommanderCard = async () => {
      try {
        const response = await searchCards({ name: commander });
        if (response.data.length > 0) {
          setCommanderCard(response.data[0]); // Update the commander card state with the fetched card
        }
      } catch (error) {
        console.error('Error fetching commander card:', error);
      }
    };

    if (visible) {
      loadCards(); // Load cards when the modal becomes visible
      loadCommanderCard(); // Load commander card when the modal becomes visible
    }
  }, [visible, deckName, user, commander]);

  // Function to filter cards by name based on search input
  const filterCardsByName = (name: string) => {
    if (!name) return cards;
    return cards.filter((card) =>
      card.name?.includes(name)
    );
  };

  // Function to handle removing a card from the deck
  const handleRemoveCard = async () => {
    if (cardToRemove) {
      try {
        await removeCardFromDeck(deckName, user, cardToRemove);
        setCards(cards.filter(card => card.name !== cardToRemove)); // Update the cards state after removal
        setConfirmVisible(false); // Close the confirmation modal
      } catch (error) {
        console.error('Error removing card from deck:', error);
      }
    }
  };

  // Function to render a single card item
  const renderItem = (item: Card) => (
    <TouchableOpacity key={item.name} style={styles.card} onPress={() => { setSelectedCard(item); setPreviewVisible(true); }}>
      <Image source={{ uri: item.image_uris?.png }} style={styles.cardImage} />
      <Text style={styles.cardName}>{item.name}</Text>
      {isUserDeck && (
        <TouchableOpacity style={styles.deleteButton} onPress={() => { setCardToRemove(item.name); setConfirmVisible(true); }}>
          <Ionicons name="trash-bin" size={24} color="red" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <>
      <Modal isVisible={visible} onBackdropPress={onClose}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Cartas en {deckName}</Text>
          <View style={styles.commanderContainer}>
            <Text style={styles.commanderText}>Comandante: {commander}</Text>
            {commanderCard && (
              <TouchableOpacity onPress={() => { setSelectedCard(commanderCard); setPreviewVisible(true); }}>
                <Image source={{ uri: commanderCard.image_uris?.png }} style={styles.commanderImage} />
              </TouchableOpacity>
            )}
          </View>
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
      {isUserDeck && (
        <Modal isVisible={confirmVisible} onBackdropPress={() => setConfirmVisible(false)}>
          <View style={styles.confirmModalContent}>
            <Text style={styles.confirmModalTitle}>Confirmar eliminación</Text>
            <Text style={styles.confirmModalMessage}>¿Estás seguro de que deseas eliminar esta carta?</Text>
            <View style={styles.confirmButtonContainer}>
              <TouchableOpacity style={styles.confirmButton} onPress={handleRemoveCard}>
                <Text style={styles.confirmButtonText}>Eliminar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setConfirmVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </>
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
  commanderContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  commanderText: {
    color: Colors.Gold,
    fontSize: 16,
  },
  commanderImage: {
    width: 100,
    height: 140,
    resizeMode: 'contain',
    marginTop: 10,
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
    justifyContent: 'center',
  },
  card: {
    height: 220,
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
  deleteButton: {
    marginTop: 10,
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
  confirmModalContent: {
    backgroundColor: Colors.GreyNeutral,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmModalTitle: {
    color: Colors.Gold,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  confirmModalMessage: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  confirmButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  confirmButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'red',
    borderRadius: 5,
    marginRight: 10,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.Gold,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DeckModal;

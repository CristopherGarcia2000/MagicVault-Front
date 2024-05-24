import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Colors from '../styles/colors';
import ManaText from './manaText';
import { getDecksFromUser, addCardToDeck, getCollectionsFromUser, addCardToCollections } from '../services/api/api';
import { useAuth } from '../components/context/AuthContext';

// Define the structure of a Card
interface Card {
  name: string;
  image_uris?: { png: string };
  type_line: string;
  mana_cost: string;
  oracle_text: string;
  power?: string;
  toughness?: string;
}

// Define the structure of a Deck or Collection
interface DeckOrCollection {
  deckname?: string;
  collectionname?: string;
  id: { timestamp: number; date: string };
  user: string;
  decklist?: string[];
  collectionlist?: string[];
}

// Define the props for the CardPreview component
interface CardPreviewProps {
  visible: boolean;
  onClose: () => void;
  card: Card | null;
}

// CardPreview component to display card details in a modal
const CardPreview: React.FC<CardPreviewProps> = ({ visible, onClose, card }) => {
  const { user } = useAuth(); // Access the authenticated user
  const [decks, setDecks] = useState<DeckOrCollection[]>([]); // State to store user's decks
  const [collections, setCollections] = useState<DeckOrCollection[]>([]); // State to store user's collections
  const [selectedDeck, setSelectedDeck] = useState<string>(''); // State to store the selected deck
  const [selectedCollection, setSelectedCollection] = useState<string>(''); // State to store the selected collection
  const [showDeckModal, setShowDeckModal] = useState<boolean>(false); // State to control deck modal visibility
  const [showCollectionModal, setShowCollectionModal] = useState<boolean>(false); // State to control collection modal visibility

  useEffect(() => {
    if (user?.username) {
      fetchUserDecks(user.username); // Fetch user decks when component mounts or user changes
      fetchUserCollections(user.username); // Fetch user collections when component mounts or user changes
    }
  }, [user]);

  // Fetch the user's decks from the API
  const fetchUserDecks = async (username: string) => {
    try {
      const response = await getDecksFromUser(username);
      setDecks(response); // Update the decks state
    } catch (error) {
      console.error('Error fetching user decks:', error);
    }
  };

  // Fetch the user's collections from the API
  const fetchUserCollections = async (username: string) => {
    try {
      const response = await getCollectionsFromUser(username);
      setCollections(response); // Update the collections state
    } catch (error) {
      console.error('Error fetching user collections:', error);
    }
  };

  // Handle adding a card to a selected deck
  const handleAddToDeck = async () => {
    if (!selectedDeck) {
      Alert.alert('Selecciona un deck', 'Por favor, selecciona un deck para añadir la carta.');
      return;
    }
    try {
      await addCardToDeck(selectedDeck, card?.name ?? '', user.username);
      Alert.alert('Carta añadida', `La carta ${card?.name} ha sido añadida al deck ${selectedDeck}`);
      setShowDeckModal(false); // Close the deck modal
      onClose(); // Close the card preview modal
    } catch (error) {
      console.error('Error adding card to deck:', error);
      Alert.alert('Error', 'Hubo un error al añadir la carta al deck.');
    }
  };

  // Handle adding a card to a selected collection
  const handleAddToCollection = async () => {
    if (!selectedCollection) {
      Alert.alert('Selecciona una colección', 'Por favor, selecciona una colección para añadir la carta.');
      return;
    }
    try {
      await addCardToCollections(selectedCollection, card?.name ?? '', user.username);
      Alert.alert('Carta añadida', `La carta ${card?.name} ha sido añadida a la colección ${selectedCollection}`);
      setShowCollectionModal(false); // Close the collection modal
      onClose(); // Close the card preview modal
    } catch (error) {
      console.error('Error adding card to collection:', error);
      Alert.alert('Error', 'Hubo un error al añadir la carta a la colección.');
    }
  };

  if (!card) {
    return null; // If no card is provided, do not render the modal
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Image
            source={{ uri: card.image_uris?.png }}
            style={styles.image}
            resizeMode="contain"
          />
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{card.name}</Text>
            <View style={styles.typeAndCost}>
              <Text style={styles.type}>{card.type_line}</Text>
              <ManaText text={card.mana_cost} />
            </View>
            {card.power && card.toughness && (
              <Text style={styles.powerToughness}>{card.power} / {card.toughness}</Text>
            )}
            <ScrollView style={styles.textContainer}>
              <ManaText text={card.oracle_text} />
            </ScrollView>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => setShowDeckModal(true)} style={styles.addButton}>
              <Text style={styles.addButtonText}>Añadir a un deck</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowCollectionModal(true)} style={styles.addButton}>
              <Text style={styles.addButtonText}>Añadir a una colección</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal for selecting a deck */}
      <Modal
        visible={showDeckModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDeckModal(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.pickerModal}>
            <Text>Seleccione un deck</Text>
            <ScrollView style={styles.optionsContainer}>
              {decks.map((deck) => (
                <TouchableOpacity
                  key={deck.id.timestamp}
                  style={styles.optionButton}
                  onPress={() => setSelectedDeck(deck.deckname!)}
                >
                  <Text style={styles.optionButtonText}>{deck.deckname}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity onPress={handleAddToDeck} style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowDeckModal(false)} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for selecting a collection */}
      <Modal
        visible={showCollectionModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCollectionModal(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.pickerModal}>
            <Text>Seleccione una colección</Text>
            <ScrollView style={styles.optionsContainer}>
              {collections.map((collection) => (
                <TouchableOpacity
                  key={collection.id.timestamp}
                  style={styles.optionButton}
                  onPress={() => setSelectedCollection(collection.collectionname!)}
                >
                  <Text style={styles.optionButtonText}>{collection.collectionname}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity onPress={handleAddToCollection} style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowCollectionModal(false)} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    backgroundColor: '#333',
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    borderRadius: 15,
    width: 200,
    height: 280,
    marginTop: 20,
    alignSelf: 'center',
  },
  infoContainer: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  typeAndCost: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  type: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#fff',
  },
  powerToughness: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'left',
    marginBottom: 10,
  },
  textContainer: {
    maxHeight: 150,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  addButton: {
    padding: 10,
    backgroundColor: Colors.Gold,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 5,
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeButton: {
    padding: 10,
    backgroundColor: Colors.Gold,
    alignItems: 'center',
    borderRadius: 5,
    margin: 10,
  },
  closeButtonText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pickerModal: {
    width: '80%',
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  optionsContainer: {
    width: '100%',
    marginVertical: 10,
  },
  optionButton: {
    padding: 10,
    backgroundColor: '#444',
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',
  },
  optionButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  confirmButton: {
    padding: 10,
    backgroundColor: Colors.Gold,
    alignItems: 'center',
    marginVertical: 5,
    width: '80%',
    borderRadius: 5,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
  },
  cancelButton: {
    padding: 10,
    backgroundColor: 'red',
    alignItems: 'center',
    marginVertical: 5,
    width: '80%',
    borderRadius: 5,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default CardPreview;

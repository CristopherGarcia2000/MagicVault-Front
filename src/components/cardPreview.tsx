import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Colors from '../styles/colors';
import ManaText from './manaText';
import { getDecksFromUser, addCardToDeck } from '../services/api/api'; // Asegúrate de que este sea el path correcto
import { useAuth } from '../components/context/AuthContext'; // Asegúrate de que este sea el path correcto

interface Card {
  name: string;
  image_uris?: { png: string };
  type_line: string;
  mana_cost: string;
  oracle_text: string;
  power?: string;
  toughness?: string;
}

interface Deck {
  deckname: string;
  id: { timestamp: number; date: string };
  user: string;
  decklist: string[];
}

interface CardPreviewProps {
  visible: boolean;
  onClose: () => void;
  card: Card | null;
}

const CardPreview: React.FC<CardPreviewProps> = ({ visible, onClose, card }) => {
  const { user } = useAuth();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<string>('');
  const [showPicker, setShowPicker] = useState<boolean>(false);

  useEffect(() => {
    if (user?.username) {
      fetchUserDecks(user.username);
    }
  }, [user]);

  const fetchUserDecks = async (username: string) => {
    try {
      const response = await getDecksFromUser(username);
      setDecks(response);
    } catch (error) {
      console.error('Error fetching user decks:', error);
    }
  };

  const handleAddToDeck = async () => {
    if (!selectedDeck) {
      Alert.alert('Selecciona un deck', 'Por favor, selecciona un deck para añadir la carta.');
      return;
    }
    try {
      await addCardToDeck(selectedDeck, card?.name ?? '', user.username);
      Alert.alert('Carta añadida', `La carta ${card?.name} ha sido añadida al deck ${selectedDeck}`);
      setShowPicker(false);
      onClose();
    } catch (error) {
      console.error('Error adding card to deck:', error);
      Alert.alert('Error', 'Hubo un error al añadir la carta al deck.');
    }
  };

  if (!card) {
    return null;
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
          <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.addButton}>
            <Text style={styles.addButtonText}>Añadir a un deck</Text>
          </TouchableOpacity>
          {showPicker && (
            <>
              <Picker
                selectedValue={selectedDeck}
                onValueChange={(itemValue) => setSelectedDeck(itemValue)}
                style={styles.picker}
              >
                {decks.map((deck) => (
                  <Picker.Item key={deck.id.timestamp} label={deck.deckname} value={deck.deckname} />
                ))}
              </Picker>
              <TouchableOpacity onPress={handleAddToDeck} style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  manaCostContainer: {
    flexDirection: 'row',
    marginBottom: 10,
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
  closeButton: {
    padding: 10,
    backgroundColor: Colors.Gold,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  addButton: {
    padding: 10,
    backgroundColor: Colors.Gold,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
  },
  confirmButton: {
    padding: 10,
    backgroundColor: Colors.Gold,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default CardPreview;

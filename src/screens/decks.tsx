import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import Modal from 'react-native-modal';
import Colors from '../styles/colors';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../components/context/AuthContext';
import { fetchDecks, addDeck, deleteDeck, fetchAllDecks } from '../services/api/api';
import DeckModal from '../components/DecksModal';
import { Deck } from '../types/decksTypes';

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const DecksScreen: React.FC = () => {
  const { user } = useAuth();
  const [allDecks, setAllDecks] = useState<Deck[]>([]);
  const [userDecks, setUserDecks] = useState<Deck[]>([]);
  const [newDeckName, setNewDeckName] = useState('');
  const [newCommanderName, setNewCommanderName] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const [deckToDelete, setDeckToDelete] = useState<Deck | null>(null);
  const [searchText, setSearchText] = useState('');
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [isUserDeck, setIsUserDeck] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const loadDecks = async () => {
    try {
      const allDecks = await fetchAllDecks();
      const userDecks = await fetchDecks(user.username);
      setAllDecks(allDecks);
      setUserDecks(userDecks);
    } catch (error) {
      console.error('Error loading decks:', error);
      Alert.alert('Error', 'No se pudo cargar los mazos.');
    }
  };

  useEffect(() => {
    loadDecks();
  }, [user]);

  const handleAddDeck = async () => {
    if (!newDeckName || !newCommanderName) {
      Alert.alert('Error', 'Por favor, complete todos los campos');
      return;
    }

    const newDeck: Deck = {
      deckname: newDeckName,
      color: getRandomColor(),
      user: user.username,
      decklist: [],
      commander: newCommanderName,
    };

    try {
      await addDeck(newDeck);
      setUserDecks([...userDecks, newDeck]);
      setNewDeckName('');
      setNewCommanderName('');
      setModalVisible(false);
    } catch (error) {
      console.error('Error adding deck:', error);
      Alert.alert('Error', 'No se pudo agregar el mazo. Verifique que el nombre del comandante sea correcto.');
    }
  };

  const confirmDeleteDeck = (deck: Deck) => {
    setDeckToDelete(deck);
    setConfirmModalVisible(true);
  };

  const handleDeleteDeck = async () => {
    if (deckToDelete) {
      try {
        await deleteDeck(deckToDelete.deckname, deckToDelete.user);
        setUserDecks(userDecks.filter(deck => deck.deckname !== deckToDelete.deckname || deck.user !== deckToDelete.user));
        setConfirmModalVisible(false);
        setDeckToDelete(null);
      } catch (error) {
        console.error('Error deleting deck:', error);
        Alert.alert('Error', 'No se pudo eliminar el mazo');
      }
    }
  };

  const handleOpenDeck = (deck: Deck, isUserDeck: boolean) => {
    setSelectedDeck(deck);
    setIsUserDeck(isUserDeck);
  };

  const handleCloseDeck = () => {
    setSelectedDeck(null);
  };

  const filteredAllDecks = allDecks.filter(deck =>
    deck.deckname.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredUserDecks = userDecks.filter(deck =>
    deck.deckname.toLowerCase().includes(searchText.toLowerCase())
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadDecks().then(() => setRefreshing(false));
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Buscar..."
        placeholderTextColor="#777"
        value={searchText}
        onChangeText={setSearchText}
      />
      <Text style={styles.sectionTitle}>Mazos de la comunidad</Text>
      <ScrollView
        style={styles.scrollView}
        ref={scrollViewRef}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {filteredAllDecks.map((deck) => (
          <TouchableOpacity key={deck.deckname} style={styles.deckItem} onPress={() => handleOpenDeck(deck, false)}>
            <View style={[styles.colorBar, { backgroundColor: deck.color }]} />
            <View style={styles.deckTextContainer}>
              <Text style={styles.deckName}>{deck.deckname}</Text>
              <Text style={styles.deckCommander}>Comandante: {deck.commander}</Text>
              <View style={styles.cardCountContainer}>
                <MaterialCommunityIcons name="cards" size={24} color="white" />
                <Text style={styles.cardCount}>Cartas: {deck.decklist.length + 1}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Text style={styles.sectionTitle}>Mis Mazos</Text>
      <ScrollView
        style={styles.scrollView}
        ref={scrollViewRef}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {filteredUserDecks.map((deck) => (
          <TouchableOpacity key={deck.deckname} style={styles.deckItem} onPress={() => handleOpenDeck(deck, true)}>
            <View style={[styles.colorBar, { backgroundColor: deck.color }]} />
            <View style={styles.deckTextContainer}>
              <Text style={styles.deckName}>{deck.deckname}</Text>
              <Text style={styles.deckCommander}>Comandante: {deck.commander}</Text>
              <View style={styles.cardCountContainer}>
                <MaterialCommunityIcons name="cards" size={24} color="white" />
                <Text style={styles.cardCount}>Cartas: {deck.decklist.length + 1}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => confirmDeleteDeck(deck)}>
              <MaterialIcons name="delete" size={24} color="#fff" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Agregar Mazo</Text>
      </TouchableOpacity>
      <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Agregar Nuevo Mazo</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre del mazo"
            placeholderTextColor="#777"
            value={newDeckName}
            onChangeText={setNewDeckName}
          />
          <TextInput
            style={styles.input}
            placeholder="Nombre del comandante"
            placeholderTextColor="#777"
            value={newCommanderName}
            onChangeText={setNewCommanderName}
          />
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity style={styles.modalButton} onPress={handleAddDeck}>
              <Text style={styles.modalButtonText}>Agregar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal isVisible={isConfirmModalVisible} onBackdropPress={() => setConfirmModalVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Confirmar Eliminación</Text>
          <Text style={styles.modalText}>¿Estás seguro de que deseas eliminar este mazo?</Text>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity style={styles.modalButton} onPress={handleDeleteDeck}>
              <Text style={styles.modalButtonText}>Sí</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setConfirmModalVisible(false)}>
              <Text style={styles.modalButtonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {selectedDeck && (
        <DeckModal
          visible={!!selectedDeck}
          onClose={handleCloseDeck}
          deckName={selectedDeck.deckname}
          commander={selectedDeck.commander}
          user={selectedDeck.user}
          isUserDeck={isUserDeck}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.GreyNeutral,
    padding: 16,
  },
  searchBar: {
    height: 40,
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#fff',
    marginBottom: 16,
  },
  scrollView: {
    maxHeight:253,
  },
  deckItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#333',
    marginBottom: 8,
  },
  deckTextContainer: {
    flex: 1,
  },
  deckName: {
    color: '#fff',
    fontSize: 14,
  },
  deckCommander: {
    color: '#fff',
    fontSize: 12,
  },
  cardCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardCount: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
  colorBar: {
    width: 20,
    height: '100%',
    borderRadius: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: Colors.Gold,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 56,
    position: 'absolute',
    bottom: 10,
    left: 16,
    right: 16,
  },
  addButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContent: {
    backgroundColor: Colors.GreyNeutral,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    color: Colors.Gold,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: Colors.Gold,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#fff',
    marginBottom: 16,
    width: '100%',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  modalButton: {
    backgroundColor: Colors.Gold,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: 'red',
  },
  modalButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: Colors.Gold,
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 14,
  },
});

export default DecksScreen;

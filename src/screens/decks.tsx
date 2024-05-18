import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, Dimensions, TouchableOpacity, Button, Alert, Image } from 'react-native';
import Modal from 'react-native-modal';
import Colors from '../styles/colors';
import { MaterialIcons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const DecksScreen: React.FC = () => {
  const [communityDecks, setCommunityDecks] = useState([
    { name: 'Slicer Deck', count: 100, colors: [require('../../assets/red.png')] },
    { name: 'Cheap Commander', count: 100, colors: [require('../../assets/green.png')] },
    { name: 'Meren Ketenge', count: 100, colors: [require('../../assets/green.png'), require('../../assets/black.png')] },
    { name: 'Codie de Codex', count: 100, colors: [require('../../assets/colorless.png')] },
    { name: 'Yugioh is so bad...', count: 100, colors: [
      require('../../assets/green.png'),
      require('../../assets/white.png'),
      require('../../assets/blue.png'),
      require('../../assets/black.png'),
      require('../../assets/red.png'),
      require('../../assets/colorless.png')
    ] },
  ]);

  const [myDecks, setMyDecks] = useState([
    { name: 'Winota Deck', count: 100, colors: [require('../../assets/red.png'), require('../../assets/white.png')] },
    { name: 'Kinnan Deck', count: 100, colors: [require('../../assets/green.png')] },
    { name: 'Volo Deck', count: 100, colors: [require('../../assets/blue.png'), require('../../assets/green.png')] },
  ]);

  const [newDeckName, setNewDeckName] = useState('');
  const [newDeckCount, setNewDeckCount] = useState('');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const [deckToDelete, setDeckToDelete] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');

  const colors = [
    { name: 'green', image: require('../../assets/green.png') },
    { name: 'white', image: require('../../assets/white.png') },
    { name: 'blue', image: require('../../assets/blue.png') },
    { name: 'black', image: require('../../assets/black.png') },
    { name: 'red', image: require('../../assets/red.png') },
    { name: 'colorless', image: require('../../assets/colorless.png') },
  ];

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const confirmDeleteDeck = (name: string) => {
    setDeckToDelete(name);
    setConfirmModalVisible(true);
  };

  const deleteDeck = () => {
    if (deckToDelete) {
      setMyDecks(myDecks.filter(deck => deck.name !== deckToDelete));
      setConfirmModalVisible(false);
      setDeckToDelete(null);
    }
  };

  const filteredCommunityDecks = communityDecks.filter(deck =>
    deck.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredMyDecks = myDecks.filter(deck =>
    deck.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const addDeck = () => {
    if (!newDeckName || !newDeckCount) {
      Alert.alert('Error', 'Por favor, complete todos los campos');
      return;
    }

    const newDeck = {
      name: newDeckName,
      count: parseInt(newDeckCount),
      colors: selectedColors.map(color => colors.find(c => c.name === color)?.image || getRandomColor()),
    };

    setMyDecks([...myDecks, newDeck]);
    setNewDeckName('');
    setNewDeckCount('');
    setSelectedColors([]);
    setModalVisible(false);
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
      <Text style={styles.title}>Mazos Comunidad</Text>
      <ScrollView style={styles.deckContainer}>
        {filteredCommunityDecks.map(deck => (
          <TouchableOpacity key={deck.name} onPress={() => {/* Navigate to preview */}}>
            <View style={styles.deckItem}>
              <View style={styles.deckDetails}>
                <Text style={styles.deckName}>{deck.name}</Text>
                <Text style={styles.deckCount}>{deck.count} Cartas</Text>
              </View>
              <View style={styles.colorImagesContainer}>
                {deck.colors.map((color, index) => (
                  <Image key={index} source={color} style={styles.colorImage} />
                ))}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.title}>Tus mazos</Text>
      <ScrollView style={styles.deckContainer}>
        {filteredMyDecks.map(deck => (
          <TouchableOpacity key={deck.name} onPress={() => {/* Navigate to preview */}}>
            <View style={styles.deckItem}>
              <View style={styles.deckDetails}>
                <Text style={styles.deckName}>{deck.name}</Text>
                <Text style={styles.deckCount}>{deck.count} Cartas</Text>
              </View>
              <View style={styles.colorImagesContainer}>
                {deck.colors.map((color, index) => (
                  <Image key={index} source={color} style={styles.colorImage} />
                ))}
              </View>
              <TouchableOpacity onPress={() => confirmDeleteDeck(deck.name)}>
                <MaterialIcons name="delete" size={20} color="#ff0000" style={styles.iconButton} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Agregar Mazo</Text>
      </TouchableOpacity>

      <Modal isVisible={isModalVisible}>
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
            placeholder="Cantidad de cartas"
            placeholderTextColor="#777"
            value={newDeckCount}
            onChangeText={setNewDeckCount}
            keyboardType="numeric"
          />
          <View style={styles.colorFilter}>
            {colors.map((color) => (
              <TouchableOpacity
                key={color.name}
                onPress={() => toggleColor(color.name)}
                style={[
                  styles.colorButton,
                  selectedColors.includes(color.name) && styles.selectedColorButton,
                ]}
              >
                <Image source={color.image} style={styles.colorImage} />
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.modalButtonContainer}>
            <View style={styles.modalButton}>
              <Button title="Agregar" onPress={addDeck} />
            </View>
            <View style={styles.modalButton}>
              <Button title="Cancelar" onPress={() => setModalVisible(false)} color="red" />
            </View>
          </View>
        </View>
      </Modal>

      <Modal isVisible={isConfirmModalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Confirmar Eliminación</Text>
          <Text style={styles.confirmText}>¿Estás seguro de que deseas eliminar este mazo?</Text>
          <View style={styles.modalButtonContainer}>
            <View style={styles.modalButton}>
              <Button title="Sí" onPress={deleteDeck}/>
            </View>
            <View style={styles.modalButton}>
              <Button title="No" onPress={() => setConfirmModalVisible(false)} color="red" />
            </View>
          </View>
        </View>
      </Modal>
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
  title: {
    color: Colors.Gold,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  deckContainer: {
    marginBottom: 16,
    maxHeight: 250,
  },
  deckItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#333',
    marginBottom: 8,
  },
  deckDetails: {
    flex: 1,
  },
  deckName: {
    color: '#fff',
    fontSize: 14,
  },
  deckCount: {
    color: '#aaa',
    fontSize: 12,
  },
  colorImagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorImage: {
    width: 30,
    height: 30,
    marginHorizontal: 2,
  },
  colorFilter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedColorButton: {
    borderColor: '#fff',
  },
  iconButton: {
    marginLeft: 8,
  },
  addButton: {
    backgroundColor: Colors.Gold,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 16,
    position: 'absolute',
    bottom: 50,
    left: 16,
    right: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContent: {
    backgroundColor: '#444',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#fff',
    marginBottom: 8,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default DecksScreen;

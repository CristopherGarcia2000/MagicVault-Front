import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, Dimensions, TouchableOpacity, Button, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { PieChart } from 'react-native-chart-kit';
import Colors from '../styles/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../components/context/AuthContext';
import { fetchCollections, addCollection, deleteCollection } from '../services/api/api';
import { Collection } from '../types/collectionsTypes';

const screenWidth = Dimensions.get('window').width;

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const CollectionsScreen: React.FC = () => {
  const { user } = useAuth();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionCount, setNewCollectionCount] = useState('');
  const [newCollectionValue, setNewCollectionValue] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const userCollections = await fetchCollections(user.username);
        setCollections(userCollections);
      } catch (error) {
        console.error('Error loading collections:', error);
      }
    };

    loadCollections();
  }, [user]);

  const totalValue = collections.reduce((acc, collection) => acc + collection.value, 0);
  const totalCards = collections.reduce((acc, collection) => acc + collection.count, 0);

  const data = collections.map(collection => ({
    collectionname: collection.collectionname,
    population: collection.value,
    color: collection.color,
  }));

  const handleAddCollection = async () => {
    if (!newCollectionName || !newCollectionCount || !newCollectionValue) {
      Alert.alert('Error', 'Por favor, complete todos los campos');
      return;
    }

    const newCollection = {
      collectionname: newCollectionName,
      count: parseInt(newCollectionCount),
      value: parseFloat(newCollectionValue),
      color: getRandomColor(),
      user: user.username,
    };

    try {
      await addCollection(newCollection);
      setCollections([...collections, newCollection]);
      setNewCollectionName('');
      setNewCollectionCount('');
      setNewCollectionValue('');
      setModalVisible(false);
    } catch (error) {
      console.error('Error adding collection:', error);
    }
  };

  const confirmDeleteCollection = (id: string | undefined) => {
    if (id) {
      setCollectionToDelete(id);
      setConfirmModalVisible(true);
    }
  };

  const handleDeleteCollection = async () => {
    if (collectionToDelete) {
      try {
        await deleteCollection(collectionToDelete);
        setCollections(collections.filter(collection => collection._id !== collectionToDelete));
        setConfirmModalVisible(false);
        setCollectionToDelete(null);
      } catch (error) {
        console.error('Error deleting collection:', error);
      }
    }
  };
  

  const filteredCollections = collections.filter(collection =>
    collection.collectionname.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Buscar..."
        placeholderTextColor="#777"
        value={searchText}
        onChangeText={setSearchText}
      />
      <Text style={styles.title}>Valor Colección</Text>
      <View style={styles.chartContainer}>
        <PieChart
          data={data}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            backgroundColor: Colors.GreyNeutral,
            backgroundGradientFrom: Colors.GreyNeutral,
            backgroundGradientTo: Colors.GreyNeutral,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          hasLegend={false}
          absolute
          style={{ marginLeft: 150 }}
        />
      </View>
      <Text style={styles.totalText}>{totalValue}€ en Colecciones</Text>
      <Text style={styles.cardCountText}>{totalCards} Cartas</Text>
      <ScrollView style={styles.collectionsContainer}>
        
      </ScrollView>
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Agregar Colección</Text>
      </TouchableOpacity>
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Agregar Nueva Colección</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre de la colección"
            placeholderTextColor="#777"
            value={newCollectionName}
            onChangeText={setNewCollectionName}
          />
          <TextInput
            style={styles.input}
            placeholder="Cantidad de cartas"
            placeholderTextColor="#777"
            value={newCollectionCount}
            onChangeText={setNewCollectionCount}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Valor de la colección"
            placeholderTextColor="#777"
            value={newCollectionValue}
            onChangeText={setNewCollectionValue}
            keyboardType="numeric"
          />
          <View style={styles.modalButtonContainer}>
            <View style={styles.modalButton}>
              <Button title="Agregar" onPress={handleAddCollection} />
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
          <Text style={styles.confirmText}>¿Estás seguro de que deseas eliminar esta colección?</Text>
          <View style={styles.modalButtonContainer}>
            <View style={styles.modalButton}>
              <Button title="Sí" onPress={handleDeleteCollection} />
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
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  totalText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 8,
  },
  cardCountText: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  collectionsContainer: {
    maxHeight: 250,
  },
  collectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#333',
    marginBottom: 8,
  },
  collectionDetails: {
    flex: 1,
  },
  collectionName: {
    color: '#fff',
    fontSize: 14,
  },
  collectionCount: {
    color: '#aaa',
    fontSize: 12,
  },
  collectionValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
  },
  colorBar: {
    width: 20,
    height: '100%',
    borderRadius: 5,
    marginRight: 10,
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

export default CollectionsScreen;

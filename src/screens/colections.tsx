import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Modal from 'react-native-modal';
import Colors from '../styles/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../components/context/AuthContext';
import { fetchCollections, addCollection, deleteCollection } from '../services/api/api'
import { Collection } from '../types/collectionsTypes';
import axios from 'axios';
import CollectionModal from '../components/CollectionModal'; 

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
  const [isModalVisible, setModalVisible] = useState(false);
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState<Collection | null>(null);
  const [searchText, setSearchText] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const userCollections = await fetchCollections(user.username);
        setCollections(userCollections);
      } catch (error) {
        console.error('Error loading collections:', error);
        Alert.alert('Error', 'No se pudo cargar las colecciones.');
      }
    };

    loadCollections();
  }, [user]);

  const handleAddCollection = async () => {
    if (!newCollectionName) {
      Alert.alert('Error', 'Por favor, complete todos los campos');
      return;
    }

    const newCollection: Collection = {
      collectionname: newCollectionName,
      color: getRandomColor(),
      user: user.username,
      collectionlist: [],
    };

    try {
      await addCollection(newCollection);
      setCollections([...collections, newCollection]);
      setNewCollectionName('');
      setModalVisible(false);
    } catch (error) {
      console.error('Error adding collection:', error);
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 409) {
          Alert.alert('Error', 'La colección con el mismo nombre ya existe para este usuario');
        } else {
          Alert.alert('Error', 'No se pudo agregar la colección');
        }
      } else {
        Alert.alert('Error', 'Ocurrió un error inesperado');
      }
    }
  };

  const confirmDeleteCollection = (collection: Collection) => {
    setCollectionToDelete(collection);
    setConfirmModalVisible(true);
  };

  const handleDeleteCollection = async () => {
    if (collectionToDelete) {
      try {
        await deleteCollection(collectionToDelete.collectionname, collectionToDelete.user);
        setCollections(collections.filter(collection => collection.collectionname !== collectionToDelete.collectionname || collection.user !== collectionToDelete.user));
        setConfirmModalVisible(false);
        setCollectionToDelete(null);
      } catch (error) {
        console.error('Error deleting collection:', error);
        Alert.alert('Error', 'No se pudo eliminar la colección');
      }
    }
  };

  const handleOpenCollection = (collection: Collection) => {
    setSelectedCollection(collection);
  };

  const handleCloseCollection = () => {
    setSelectedCollection(null);
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
      <ScrollView style={styles.collectionsContainer}>
        {filteredCollections.map((collection) => (
          <TouchableOpacity key={collection.collectionname} style={styles.collectionItem} onPress={() => handleOpenCollection(collection)}>
            <View style={[styles.colorBar, { backgroundColor: collection.color }]} />
            <Text style={styles.collectionName}>{collection.collectionname}</Text>
            <TouchableOpacity onPress={() => confirmDeleteCollection(collection)}>
              <MaterialIcons name="delete" size={24} color="#fff" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Agregar Colección</Text>
      </TouchableOpacity>
      <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Agregar Nueva Colección</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre de la colección"
            placeholderTextColor="#777"
            value={newCollectionName}
            onChangeText={setNewCollectionName}
          />
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity style={styles.modalButton} onPress={handleAddCollection}>
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
          <Text style={styles.modalText}>¿Estás seguro de que deseas eliminar esta colección?</Text>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity style={styles.modalButton} onPress={handleDeleteCollection}>
              <Text style={styles.modalButtonText}>Sí</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setConfirmModalVisible(false)}>
              <Text style={styles.modalButtonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {selectedCollection && (
        <CollectionModal
          visible={!!selectedCollection}
          onClose={handleCloseCollection}
          collectionName={selectedCollection.collectionname}
          user={user.username}
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
  collectionName: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
  colorBar: {
    width: 20,
    height: '100%',
    borderRadius: 5,
    marginRight: 10,
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
    justifyContent: 'space-between',
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
});

export default CollectionsScreen;

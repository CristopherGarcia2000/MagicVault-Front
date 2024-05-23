import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity, Alert, RefreshControl, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import { PieChart } from 'react-native-chart-kit';
import Colors from '../styles/colors';
import { MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '../components/context/AuthContext';
import { fetchCollections, addCollection, deleteCollection, fetchCollectionCards } from '../services/api/api';
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
  const [collectionPrices, setCollectionPrices] = useState<{ [key: string]: number }>({});
  const [newCollectionName, setNewCollectionName] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState<Collection | null>(null);
  const [searchText, setSearchText] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const loadCollections = async () => {
    try {
      const userCollections = await fetchCollections(user.username);
      setCollections(userCollections);

      const prices = await Promise.all(userCollections.map(async (collection) => {
        const totalValue = await loadCollectionsTotalPrice(collection.collectionname);
        return { [collection.collectionname]: totalValue };
      }));
      setCollectionPrices(Object.assign({}, ...prices));
    } catch (error) {
      console.error('Error loading collections:', error);
      Alert.alert('Error', 'No se pudo cargar las colecciones.');
    }
  };

  const loadCollectionsTotalPrice = async (collectionName: string) => {
    const fetchedCards = await fetchCollectionCards(user.username, collectionName);
    const totalValue = fetchedCards.reduce((total, card) => total + (parseFloat(card.prices.eur) || 0), 0);
    return parseFloat(totalValue.toFixed(2));
  };

  useEffect(() => {
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
      const newPrice = await loadCollectionsTotalPrice(newCollectionName);
      setCollectionPrices({ ...collectionPrices, [newCollectionName]: newPrice });
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

  const onRefresh = () => {
    setRefreshing(true);
    loadCollections().then(() => setRefreshing(false));
  };

  const totalValue = Object.values(collectionPrices).reduce((sum, value) => sum + Number(value), 0).toFixed(2);
  const totalCards = collections.reduce((sum, collection) => sum + collection.collectionlist.length, 0);

  const pieChartData = collections.map(collection => ({
    name: collection.collectionname,
    value: collectionPrices[collection.collectionname] || 0,
    color: collection.color,
    legendFontColor: "#7F7F7F",
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <PieChart
          style = {styles.piechart}
          data={pieChartData}
          width={220}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
          }}
          accessor="value"
          backgroundColor="transparent"
          paddingLeft="50"
          hasLegend={false}
        />
      </View>
      <View style={styles.textContainer}>
          <Text style={styles.totalText}>Valor Total: €{totalValue}</Text>
          <Text style={styles.totalText}>Total de Cartas: {totalCards}</Text>
        </View>
      <TextInput
        style={styles.searchBar}
        placeholder="Buscar..."
        placeholderTextColor="#777"
        value={searchText}
        onChangeText={setSearchText}
      />
      <View> 
      <ScrollView
        style={styles.scrollView}
        ref={scrollViewRef}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={({ nativeEvent }) => {
          if (nativeEvent.contentOffset.y <= 0) {
            loadCollections();
          }
        }}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {filteredCollections.map((collection) => (
          <TouchableOpacity key={collection.collectionname} style={styles.collectionItem} onPress={() => handleOpenCollection(collection)}>
            <View style={[styles.colorBar, { backgroundColor: collection.color }]} />
            <View style={styles.collectionTextContainer}>
              <Text style={styles.collectionName}>{collection.collectionname}</Text>
              <View style={styles.cardCountContainer}>
                <MaterialCommunityIcons name="cards" size={24} color="white" />
                <Text style={styles.cardCount}>Cartas: {collection.collectionlist.length}</Text>
              </View>
              <View style={styles.moneyCountContainer}>
                <FontAwesome5 name="coins" size={15} color="white" />
                <Text style={styles.moneyCount}>Valor: €{collectionPrices[collection.collectionname] !== undefined ? Number(collectionPrices[collection.collectionname]).toFixed(2) : 'Cargando...'}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => confirmDeleteCollection(collection)}>
              <MaterialIcons name="delete" size={24} color="#fff" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
      </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  textContainer: {
    alignItems: 'center',
  },

  piechart: {
    marginLeft:80
  },
  scrollView:{
    height:259,
    marginBottom:100
  },
  totalText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  searchBar: {
    marginTop:50,
    height: 40,
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#fff',
    marginBottom: 16,
  },
  collectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#333',
    marginBottom: 8,
  },
  collectionTextContainer: {
    flex: 1,
  },
  collectionName: {
    color: '#fff',
    fontSize: 14,
  },
  cardCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moneyCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 4,
    marginLeft: 10
  },
  cardCount: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
  moneyCount: {
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
});

export default CollectionsScreen;

import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, Dimensions, TouchableOpacity, Button, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { PieChart } from 'react-native-chart-kit';
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

const CollectionsScreen: React.FC = () => {
  const [collections, setCollections] = useState([
    { name: 'Cartas para cambiar', count: 454, value: 253, color: '#00bfa5' },
    { name: 'Caja Ravnica Remastered', count: 231, value: 123, color: '#6200ea' },
    { name: 'Caja Commander Masters', count: 121, value: 12, color: '#ffab00' },
  ]);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionCount, setNewCollectionCount] = useState('');
  const [newCollectionValue, setNewCollectionValue] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');

  const totalValue = collections.reduce((acc, collection) => acc + collection.value, 0);
  const totalCards = collections.reduce((acc, collection) => acc + collection.count, 0);

  const data = collections.map(collection => ({
    name: collection.name,
    population: collection.value,  // Usamos el valor en lugar de la cantidad
    color: collection.color,
  }));

  const addCollection = () => {
    if (!newCollectionName || !newCollectionCount || !newCollectionValue) {
      Alert.alert('Error', 'Por favor, complete todos los campos');
      return;
    }

    const newCollection = {
      name: newCollectionName,
      count: parseInt(newCollectionCount),
      value: parseFloat(newCollectionValue),
      color: getRandomColor(),
    };

    setCollections([...collections, newCollection]);
    setNewCollectionName('');
    setNewCollectionCount('');
    setNewCollectionValue('');
    setModalVisible(false);
  };

  const confirmDeleteCollection = (name: string) => {
    setCollectionToDelete(name);
    setConfirmModalVisible(true);
  };

  const deleteCollection = () => {
    if (collectionToDelete) {
      setCollections(collections.filter(collection => collection.name !== collectionToDelete));
      setConfirmModalVisible(false);
      setCollectionToDelete(null);
    }
  };

  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchText.toLowerCase())
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
        {filteredCollections.map(collection => (
          <TouchableOpacity key={collection.name} onPress={() => {/* Navigate to preview */}}>
            <View style={styles.collectionItem}>
              <View style={styles.collectionDetails}>
                <Text style={styles.collectionName}>{collection.name}</Text>
                <Text style={styles.collectionCount}>{collection.count} Cartas</Text>
              </View>
              <Text style={styles.collectionValue}>{collection.value}€</Text>
              <View style={[styles.colorBar, { backgroundColor: collection.color }]} />
              <TouchableOpacity onPress={() => confirmDeleteCollection(collection.name)}>
                <MaterialIcons name="delete" size={20} color="#ff0000" style={styles.iconButton} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
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
              <Button title="Agregar" onPress={addCollection} />
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
              <Button title="Sí" onPress={deleteCollection}/>
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

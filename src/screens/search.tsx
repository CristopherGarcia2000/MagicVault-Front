import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Colors from '../styles/colors';
import { fetchExpansions } from '../services/api/api';

const SearchScreen: React.FC = () => {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedExpansion, setSelectedExpansion] = useState<string>('');
  const [expansions, setExpansions] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedExpansions = await fetchExpansions();
        setExpansions(fetchedExpansions);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const colors = [
    { name: 'green', image: require('../../assets/green.png') },
    { name: 'white', image: require('../../assets/white.png') },
    { name: 'blue', image: require('../../assets/blue.png') },
    { name: 'black', image: require('../../assets/black.png') },
    { name: 'red', image: require('../../assets/red.png') },
    { name: 'colorless', image: require('../../assets/colorless.png') },
    
  ];

  const types = [
    { label: 'Criatura', value: 'criatura' },
    { label: 'Conjuro', value: 'conjuro' },
    { label: 'Instantáneo', value: 'instantaneo' },
  ];

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <TextInput
        style={styles.searchBar}
        placeholder="Buscar Cartas..."
        placeholderTextColor="#777"
      />
      <View style={styles.filters}>
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
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedType}
            onValueChange={(itemValue: string) => setSelectedType(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Tipos" value="" />
            {types.map((type) => (
              <Picker.Item key={type.value} label={type.label} value={type.value} />
            ))}
          </Picker>
          <Picker
            selectedValue={selectedExpansion}
            onValueChange={(itemValue: string) => setSelectedExpansion(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Expansión" value="" />
            {expansions.map((expansion) => (
              <Picker.Item key={expansion.value} label={expansion.label} value={expansion.value} />
            ))}
          </Picker>
        </View>
      </View>
      <TouchableOpacity style={styles.searchButton}>
        <Text style={styles.searchButtonText}>BUSCAR</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.GreyNeutral,
    alignItems: 'center',
    justifyContent: 'center',
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
    width: '100%',
  },
  filters: {
    marginBottom: 16,
    width: '100%',
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
  colorImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  picker: {
    height: 50,
    flex: 1,
    color: '#fff',
  },
  searchButton: {
    backgroundColor: '#ffcc00',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  searchButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.GreyNeutral,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SearchScreen;

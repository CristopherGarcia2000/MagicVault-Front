import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Colors from '../styles/colors';

const SearchScreen: React.FC = () => {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedExpansion, setSelectedExpansion] = useState<string>('');

  const colors: { name: string; backgroundColor: string }[] = [
    { name: 'green', backgroundColor: 'green' },
    { name: 'white', backgroundColor: 'white' },
    { name: 'blue', backgroundColor: 'blue' },
    { name: 'black', backgroundColor: 'black' },
    { name: 'red', backgroundColor: 'red' }
  ];

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

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
                { backgroundColor: color.backgroundColor },
                selectedColors.includes(color.name) && styles.selectedColorButton,
              ]}
            />
          ))}
        </View>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedType}
            onValueChange={(itemValue: string) => setSelectedType(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Tipos" value="" />
            <Picker.Item label="Criatura" value="criatura" />
            <Picker.Item label="Hechizo" value="hechizo" />
          </Picker>
          <Picker
            selectedValue={selectedExpansion}
            onValueChange={(itemValue: string) => setSelectedExpansion(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Expansión" value="" />
            <Picker.Item label="Expansión 1" value="expansion1" />
            <Picker.Item label="Expansión 2" value="expansion2" />
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
});

export default SearchScreen;


import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image, FlatList, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Colors from '../styles/colors';
import { fetchExpansions, searchCards, CardSearchFilter } from '../services/api/api';
import CardPreview from '../components/cardPreview';
import { Card } from '../types/cardsType';

const SearchScreen: React.FC = () => {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedExpansion, setSelectedExpansion] = useState<string>('');
  const [expansions, setExpansions] = useState<{ label: string; value: string }[]>([]);
  const [results, setResults] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [cardName, setCardName] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const filter: CardSearchFilter = {};
      if (selectedColors.length > 0) {
        filter.colors = selectedColors;
      }
      if (selectedType) {
        filter.type = selectedType;
      }
      if (selectedExpansion) {
        filter.expansion = selectedExpansion;
      }
      if (cardName) {
        filter.name = cardName;
      }

      const searchResults = await searchCards(filter);
      setResults(searchResults.data);
    } catch (error) {
      console.error('Error searching cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Card }) => (
    <TouchableOpacity style={styles.card} onPress={() => { setSelectedCard(item); setPreviewVisible(true); }}>
      <Image source={{ uri: item.image_uris?.png }} style={styles.cardImage} />
      <Text style={styles.cardName}>{item.name}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Buscar Cartas..."
        placeholderTextColor="#777"
        onChangeText={setCardName}
        value={cardName}
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
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>BUSCAR</Text>
      </TouchableOpacity>
      <FlatList
        data={results}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.list}
        numColumns={2}
      />
      {selectedCard && (
        <CardPreview
          visible={previewVisible}
          onClose={() => setPreviewVisible(false)}
          card={{
            ...selectedCard,
            power: selectedCard.power?.toString(),
            toughness: selectedCard.toughness?.toString(),
          }}
        />
      )}
    </View>
  );
};

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

const colors = [
  { name: 'W', image: require('../../assets/white.png') },
  { name: 'U', image: require('../../assets/blue.png') },
  { name: 'B', image: require('../../assets/black.png') },
  { name: 'R', image: require('../../assets/red.png') },
  { name: 'G', image: require('../../assets/green.png') },
  { name: 'C', image: require('../../assets/colorless.png') },
];

const types = [
  { label: 'Criatura', value: 'creature' },
  { label: 'Conjuro', value: 'sorcery' },
  { label: 'Instantáneo', value: 'instant' },
  { label: 'Encantamiento', value: 'enchantment' },
  { label: 'Artefacto', value: 'artifact' },
  { label: 'Planeswalker', value: 'planeswalker' },
  { label: 'Tierra', value: 'land' },
];

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
  list: {
    width: '100%',
  },
  card: {
    width: cardWidth,
    height: cardWidth * 1.4,
    padding: 10,
    backgroundColor: '#444',
    marginVertical: 5,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  cardImage: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
  },
  cardName: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.GreyNeutral,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SearchScreen;

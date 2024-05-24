import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image, FlatList, Dimensions, Modal, ScrollView } from 'react-native';
import Colors from '../styles/colors';
import { fetchExpansions, searchCards, CardSearchFilter } from '../services/api/api';
import CardPreview from '../components/cardPreview';
import ManaText from '../components/manaText';
import { Card } from '../types/cardsType';
import { useAuth } from '../components/context/AuthContext';

const SearchScreen: React.FC = () => {
  const { addVisitedCard } = useAuth(); // Fetch the addVisitedCard function from the authentication context
  const [selectedColors, setSelectedColors] = useState<string[]>([]); // Manage selected colors for filtering
  const [selectedType, setSelectedType] = useState<string>(''); // Manage selected type for filtering
  const [selectedExpansion, setSelectedExpansion] = useState<string>(''); // Manage selected expansion for filtering
  const [expansions, setExpansions] = useState<{ label: string; value: string }[]>([]); // Store fetched expansions
  const [results, setResults] = useState<Card[]>([]); // Store search results
  const [loading, setLoading] = useState<boolean>(true); // Manage loading state
  const [selectedCard, setSelectedCard] = useState<Card | null>(null); // Manage selected card for preview
  const [previewVisible, setPreviewVisible] = useState<boolean>(false); // Control visibility of card preview modal
  const [cardName, setCardName] = useState<string>(''); // Manage card name input for searching
  const [noResultsModalVisible, setNoResultsModalVisible] = useState<boolean>(false); // Control visibility of no results modal
  const [typeModalVisible, setTypeModalVisible] = useState<boolean>(false); // Control visibility of type selection modal
  const [expansionModalVisible, setExpansionModalVisible] = useState<boolean>(false); // Control visibility of expansion selection modal

  // Fetch expansions on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const fetchedExpansions = await fetchExpansions(); // Fetch expansions from API
        setExpansions(fetchedExpansions); // Set fetched expansions to state
      } catch (error) {
        console.error('Error fetching data:', error); // Log error if fetching fails
      } finally {
        setLoading(false); // Set loading state to false
      }
    };

    fetchData();
  }, []);

  // Toggle selected color for filtering
  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  // Handle card search
  const handleSearch = async () => {
    setLoading(true);
    try {
      const filter: CardSearchFilter = {};
      if (selectedColors.length > 0) {
        filter.colors = selectedColors; // Add selected colors to filter
      }
      if (selectedType) {
        filter.type = selectedType; // Add selected type to filter
      }
      if (selectedExpansion) {
        filter.expansion = selectedExpansion; // Add selected expansion to filter
      }
      if (cardName) {
        filter.name = cardName; // Add card name to filter
      }

      const searchResults = await searchCards(filter); // Fetch search results from API
      if (searchResults && Array.isArray(searchResults.data)) {
        setResults(searchResults.data); // Set search results to state

        if (searchResults.data.length === 0) {
          setNoResultsModalVisible(true); // Show no results modal if no cards found
        }
      } else {
        setResults([]);
        setNoResultsModalVisible(true); // Show no results modal if no cards found
      }
    } catch (error) {
      console.error('Error searching cards:', error); // Log error if searching fails
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  // Handle card press to show preview
  const handleCardPress = (card: Card) => {
    addVisitedCard(card); // Add card to visited cards
    setSelectedCard(card); // Set selected card for preview
    setPreviewVisible(true); // Show card preview modal
  };
  
  // Render each card item in the FlatList
  const renderItem = ({ item }: { item: Card }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleCardPress(item)}>
      <Image source={{ uri: item.image_uris?.png }} style={styles.cardImage} />
      <Text style={styles.cardName}>{item.name}</Text>
      {item.mana_cost && <ManaText text={item.mana_cost} />}
      <View style={styles.priceContainer}>
        <Text style={styles.cardPrice}>
          {item.prices.eur ? `€${item.prices.eur}` : 'N/A'}
        </Text>
      </View>
    </TouchableOpacity>
  );

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
          <TouchableOpacity onPress={() => setTypeModalVisible(true)} style={styles.modalOpenButton}>
            <Text style={styles.modalOpenButtonText}>{selectedType ? types.find(type => type.value === selectedType)?.label : 'Seleccionar Tipo'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setExpansionModalVisible(true)} style={styles.modalOpenButton}>
            <Text style={styles.modalOpenButtonText}>{selectedExpansion ? expansions.find(exp => exp.value === selectedExpansion)?.label : 'Seleccionar Expansión'}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>BUSCAR</Text>
      </TouchableOpacity>
      <View style={styles.resultsContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#ffffff" />
        ) : (
          <FlatList
            data={results}
            renderItem={renderItem}
            keyExtractor={(item) => item.name}
            contentContainerStyle={styles.list}
            numColumns={2}
          />
        )}
      </View>
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
      <Modal
        visible={noResultsModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setNoResultsModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>No hay resultados</Text>
            <Text style={styles.modalMessage}>No se encontraron cartas con los criterios de búsqueda especificados.</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setNoResultsModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible={typeModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setTypeModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={[styles.modalContainer, { maxHeight: '80%' }]}>
            <Text style={styles.modalTitle}>Seleccionar Tipo</Text>
            <ScrollView style={styles.scrollView}>
              <TouchableOpacity onPress={() => { setSelectedType(''); setTypeModalVisible(false); }}>
                <Text style={styles.modalItem}>Sin filtro</Text>
              </TouchableOpacity>
              {types.map((type) => (
                <TouchableOpacity key={type.value} onPress={() => { setSelectedType(type.value); setTypeModalVisible(false); }}>
                  <Text style={styles.modalItem}>{type.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setTypeModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible={expansionModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setExpansionModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={[styles.modalContainer, { maxHeight: '80%' }]}>
            <Text style={styles.modalTitle}>Seleccionar Expansión</Text>
            <ScrollView style={styles.scrollView}>
              <TouchableOpacity onPress={() => { setSelectedExpansion(''); setExpansionModalVisible(false); }}>
                <Text style={styles.modalItem}>Sin filtro</Text>
              </TouchableOpacity>
              {expansions.map((expansion) => (
                <TouchableOpacity key={expansion.value} onPress={() => { setSelectedExpansion(expansion.value); setExpansionModalVisible(false); }}>
                  <Text style={styles.modalItem}>{expansion.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setExpansionModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalOpenButton: {
    backgroundColor: Colors.Gold,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    justifyContent:'center'
  },
  modalOpenButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
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
  resultsContainer: {
    flex: 1,
    width: '100%',
    margin: 10,
  },
  list: {
    width: '100%',
  },
  card: {
    width: cardWidth,
    height: cardWidth * 1.3,
    padding: 10,
    backgroundColor: '#444',
    marginVertical: 5,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  cardImage: {
    width: '100%',
    height: '60%',
    resizeMode: 'contain',
  },
  cardName: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 5,
  },
  priceContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 5,
    marginTop: 5,
  },
  cardPrice: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  noResultsText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: Colors.GreyNeutral,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.Gold,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: Colors.Gold,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalItem: {
    fontSize: 16,
    color: '#fff',
    paddingVertical: 10,
    textAlign: 'center',
  },
  scrollView: {
    width: '100%',
  },
});

export default SearchScreen;

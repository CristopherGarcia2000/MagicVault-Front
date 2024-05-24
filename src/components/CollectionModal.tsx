import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for icons
import Colors from '../styles/colors';
import { fetchCollectionCards, removeCardFromCollection } from '../services/api/api';
import { Card } from '../types/cardsType';
import CardPreview from '../components/cardPreview';

// Define the props for the CollectionModal component
interface CollectionModalProps {
    visible: boolean;
    onClose: () => void;
    collectionName: string;
    user: string;
}

// CollectionModal component to display a collection of cards
const CollectionModal: React.FC<CollectionModalProps> = ({ visible, onClose, collectionName, user }) => {
    const [cards, setCards] = useState<Card[]>([]); // State to store cards in the collection
    const [loading, setLoading] = useState<boolean>(true); // State to manage loading state
    const [cardName, setCardName] = useState<string>(''); // State to manage the search input value
    const [selectedCard, setSelectedCard] = useState<Card | null>(null); // State to manage the selected card for preview
    const [previewVisible, setPreviewVisible] = useState<boolean>(false); // State to control card preview modal visibility
    const [confirmVisible, setConfirmVisible] = useState<boolean>(false); // State to control confirmation modal visibility
    const [cardToRemove, setCardToRemove] = useState<string | null>(null); // State to store the card name to be removed

    useEffect(() => {
        const loadCards = async () => {
            setLoading(true);
            try {
                const fetchedCards = await fetchCollectionCards(user, collectionName);
                setCards(fetchedCards); // Update the cards state with fetched cards
            } catch (error) {
                console.error('Error fetching cards:', error);
            } finally {
                setLoading(false); // Set loading to false after fetching cards
            }
        };

        if (visible) {
            loadCards(); // Load cards when the modal becomes visible
        }
    }, [visible, collectionName, user]);

    // Filter cards by name based on search input
    const filterCardsByName = (name: string) => {
        if (!name) return cards;
        return cards.filter((card) =>
            card.name?.includes(name)
        );
    };

    // Handle removing a card from the collection
    const handleRemoveCard = async () => {
        if (cardToRemove) {
            try {
                await removeCardFromCollection(collectionName, user, cardToRemove);
                setCards(cards.filter(card => card.name !== cardToRemove)); // Update the cards state after removal
                setConfirmVisible(false); // Close the confirmation modal
            } catch (error) {
                console.error('Error removing card from collection:', error);
            }
        }
    };

    // Render a single card item
    const renderItem = (item: Card) => (
        <TouchableOpacity key={item.name} style={styles.card} onPress={() => { setSelectedCard(item); setPreviewVisible(true); }}>
            <Image source={{ uri: item.image_uris?.png }} style={styles.cardImage} />
            <Text style={styles.cardName}>{item.name}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={() => { setCardToRemove(item.name); setConfirmVisible(true); }}>
                <Ionicons name="trash-bin" size={24} color="red" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <>
            <Modal isVisible={visible} onBackdropPress={onClose}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Cartas en {collectionName}</Text>
                    <TextInput
                        style={styles.searchBar}
                        placeholder="Buscar Cartas..."
                        placeholderTextColor="#777"
                        onChangeText={setCardName}
                        value={cardName}
                    />
                    {loading ? (
                        <ActivityIndicator size="large" color={Colors.Gold} />
                    ) : (
                        <ScrollView contentContainerStyle={styles.scrollContainer}>
                            <View style={styles.cardsContainer}>
                                {filterCardsByName(cardName).map(renderItem)}
                            </View>
                        </ScrollView>
                    )}
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Cerrar</Text>
                    </TouchableOpacity>
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
            </Modal>
            <Modal isVisible={confirmVisible} onBackdropPress={() => setConfirmVisible(false)}>
                <View style={styles.confirmModalContent}>
                    <Text style={styles.confirmModalTitle}>Confirmar eliminación</Text>
                    <Text style={styles.confirmModalMessage}>¿Estás seguro de que deseas eliminar esta carta?</Text>
                    <View style={styles.confirmButtonContainer}>
                        <TouchableOpacity style={styles.confirmButton} onPress={handleRemoveCard}>
                            <Text style={styles.confirmButtonText}>Eliminar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => setConfirmVisible(false)}>
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: Colors.GreyNeutral,
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        maxHeight: '80%',
    },
    modalTitle: {
        color: Colors.Gold,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
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
    scrollContainer: {
        width: '100%',
    },
    cardsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        height: 220,
        width: 100,
        padding: 5,
        marginVertical: 5,
        marginHorizontal: 5,
        borderRadius: 5,
        alignItems: 'center',
    },
    cardImage: {
        width: '100%',
        height: 120,
        resizeMode: 'contain',
    },
    cardName: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
        marginVertical: 5,
    },
    deleteButton: {
        marginTop: 10,
    },
    closeButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: Colors.Gold,
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#333',
        fontSize: 16,
        fontWeight: 'bold',
    },
    confirmModalContent: {
        backgroundColor: Colors.GreyNeutral,
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    confirmModalTitle: {
        color: Colors.Gold,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    confirmModalMessage: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
    },
    confirmButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
    },
    confirmButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: 'red',
        borderRadius: 5,
        marginRight: 10,
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: Colors.Gold,
        borderRadius: 5,
    },
    cancelButtonText: {
        color: '#333',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CollectionModal;

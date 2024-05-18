import { StatusBar } from 'expo-status-bar';
import Colors from '../styles/colors'
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { fetchRandomCommander } from '../services/scryfall';
import CardPreview from '../components/cardPreview';

export default function HomeScreen() {
  const [randomCommander, setRandomCommander] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  useEffect(() => {
    fetchCommander();
  }, []);

  const fetchCommander = async () => {
    try {
      setLoading(true);
      const commander = await fetchRandomCommander();
      setRandomCommander(commander);
    } catch (error) {
      console.error('Error fetching commander:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRandomCommander = () => {
    fetchCommander();
  };

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : randomCommander ? (
        <>
          <Text style={styles.name}>{randomCommander.name}</Text>
          <TouchableOpacity onPress={handleOpenModal}>
            <Image
              source={{ uri: randomCommander.image_uris.normal }}
              style={styles.image}
            />
          </TouchableOpacity>
          <Button title="Generar otro commander" onPress={handleGenerateRandomCommander} />
        </>
      ) : (
        <Text>No se encontraron datos.</Text>
      )}
      <CardPreview
        visible={isModalVisible}
        onClose={handleCloseModal}
        commander={randomCommander}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.GreyNeutral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 24,
    marginBottom: 10,
    color: '#fff',
  },
  image: {
    borderRadius:15,
    width: 200,
    height: 280,
    marginBottom: 20,
  },
});

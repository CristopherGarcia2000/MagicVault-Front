import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Text } from 'react-native';
import Colors from '../styles/colors';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelectedScreen } from './context/selectedScreenContext';
import { useAuth } from './context/AuthContext';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Search: undefined;
  Collections: undefined;
  Decks: undefined;
  Scanner: undefined;
  UserProfile: undefined;
};

const Footer = () => {
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList>>();
  const { selectedScreen, setSelectedScreen } = useSelectedScreen();
  const { isAuthenticated } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);

  // Handle navigation with authentication check
  const handlePress = (screen: keyof RootStackParamList) => {
    if (!isAuthenticated && (screen === 'Decks' || screen === 'Collections')) {
      setModalVisible(true); // Show modal if user is not authenticated
      return;
    }
    setSelectedScreen(screen); // Update the selected screen context
    navigation.navigate(screen); // Navigate to the selected screen
  };

  // Close the modal
  const closeModal = () => {
    setModalVisible(false);
  };

  // Navigate to login screen and close the modal
  const handleLogin = () => {
    setModalVisible(false);
    navigation.navigate('Login');
  };

  // Navigate to register screen and close the modal
  const handleRegister = () => {
    setModalVisible(false);
    navigation.navigate('Register');
  };

  return (
    <View style={styles.footer}>
      <TouchableOpacity
        onPress={() => handlePress('Home')}
        style={[
          styles.buttonBackground,
          selectedScreen === 'Home' && styles.selectedButton
        ]}
      >
        <MaterialIcons name="home" size={30} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handlePress('Search')}
        style={[
          styles.buttonBackground,
          selectedScreen === 'Search' && styles.selectedButton
        ]}
      >
        <MaterialIcons name="search" size={30} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handlePress('Decks')}
        style={[
          styles.buttonBackground,
          selectedScreen === 'Decks' && styles.selectedButton
        ]}
      >
        <MaterialCommunityIcons name="cards" size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handlePress('Collections')}
        style={[
          styles.buttonBackground,
          selectedScreen === 'Collections' && styles.selectedButton
        ]}
      >
        <MaterialIcons name="collections-bookmark" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Acceso restringido</Text>
            <Text style={styles.modalMessage}>Por favor, inicia sesión o regístrate para acceder a esta sección.</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={handleLogin}>
                <Text style={styles.modalButtonText}>Iniciar Sesión</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleRegister}>
                <Text style={styles.modalButtonText}>Registrarse</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.closeButton]} onPress={closeModal}>
                <Text style={styles.modalButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.GreyDark, 
    paddingVertical: 10, 
    borderTopWidth: 1, 
    borderTopColor: '#ccc', 
    position: 'absolute', 
    bottom: 0,
    width: '100%', 
  },
  buttonBackground: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    width: 80,
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  selectedButton: {
    backgroundColor: Colors.Gold, 
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center', 
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: Colors.GreyNeutral, 
    borderRadius: 10, 
    padding: 20, 
    alignItems: 'center', 
  },
  modalTitle: {
    fontSize: 20, 
    fontWeight: 'bold', 
    color: Colors.Gold, 
    marginBottom: 10, 
  },
  modalMessage: {
    fontSize: 16,
    color: '#fff', 
    textAlign: 'center', 
    marginBottom: 20, 
  },
  modalButtonContainer: {
    width: '100%',
  },
  modalButton: {
    backgroundColor: Colors.Gold, 
    paddingVertical: 10, 
    borderRadius: 5, 
    alignItems: 'center',
    marginVertical: 5, 
  },
  modalButtonText: {
    color: '#333', 
    fontSize: 16,
    fontWeight: 'bold', 
  },
  closeButton: {
    backgroundColor: 'red',
  },
});

export default Footer;

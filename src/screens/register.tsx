import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../styles/colors';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { registerUser, loginUser } from '../services/api/api';
import { useAuth } from '../components/context/AuthContext';

export default function RegisterScreen() {
  const [username, setUsername] = useState(''); // State for managing username input
  const [password, setPassword] = useState(''); // State for managing password input
  const [email, setEmail] = useState(''); // State for managing email input
  const [isLoading, setIsLoading] = useState(false); // State for managing loading indicator
  const [modalVisible, setModalVisible] = useState(false); // State for managing modal visibility
  const [modalMessage, setModalMessage] = useState(''); // State for managing modal message

  const { login } = useAuth(); // Get login function from AuthContext
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList>>(); // Get navigation prop

  const handlerRegister = async () => {
    if (!username || !email || !password) {
      setModalMessage('Por favor, rellena todos los campos.'); // Set modal message for empty fields
      setModalVisible(true); // Show modal
      return;
    }

    setIsLoading(true); // Show loading indicator
    try {
      await registerUser(username, email, password); // Register user
      const token = await loginUser(username, password); // Log in user and get token
      login({ username }, token); // Use login function from AuthContext
      navigation.navigate('Home'); // Navigate to Home screen
    } catch (error: any) {
      setModalMessage(error.message); // Set modal message for error
      setModalVisible(true); // Show modal
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <Text style={styles.title}>Bienvenido al Registro</Text>

      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="grey" />
        <TextInput
          style={styles.input}
          onChangeText={setUsername}
          value={username}
          placeholder="Username"
          placeholderTextColor="grey"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="grey" />
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder="Email"
          placeholderTextColor="grey"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="grey" />
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          placeholderTextColor="grey"
        />
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.Gold} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handlerRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Colors.GreyNeutral,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: Colors.Beige,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.GreyDark,
    padding: 10,
  },
  input: {
    height: 40,
    flex: 1,
    marginLeft: 10,
    color: 'black',
  },
  button: {
    backgroundColor: Colors.Gold,
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonClose: {
    backgroundColor: Colors.Gold,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

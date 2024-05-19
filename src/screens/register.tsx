import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../styles/colors';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { registerUser, getUser } from '../services/api/api';
import { AuthProvider, useAuth } from '../components/context/AuthContext';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const { login } = useAuth();
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList>>();

  const handlerRegister = async () => {
    if (!username || !email || !password) {
      setModalMessage('Por favor, rellena todos los campos.');
      setModalVisible(true);
      return;
    }

    setIsLoading(true);
    try {
      const token = await registerUser(username, email, password);
      const user = await getUser(username , password); 
      login(user, token);
      navigation.navigate('Home');
    } catch (error:any) {
      setModalMessage(error.message);
      setModalVisible(true);
    } finally {
      setIsLoading(false);
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

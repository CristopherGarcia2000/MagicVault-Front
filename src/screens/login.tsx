import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Colors from '../styles/colors';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { getUser, loginUser } from '../services/api/api';
import { useAuth } from '../components/context/AuthContext';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const { login } = useAuth();
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList>>();

  const handleLogin = async () => {
    if (!username || !password) {
      setModalMessage('Por favor, rellena todos los campos.');
      setModalVisible(true);
      return;
    }

    setIsLoading(true);
    try {
      // Llamar a la función de login del contexto de autenticación
      const token = await loginUser(username, password);
      login({ username }, token); // Pasar el usuario y el token a la función login
      navigation.navigate('Home');
    } catch (error) {
      setModalMessage('Usuario o contraseña incorrectos.');
      setModalVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <Text style={styles.title}>Bienvenido al Login</Text>
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
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      )}
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
});


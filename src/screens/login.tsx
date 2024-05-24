import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Colors from '../styles/colors';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { getUser, loginUser } from '../services/api/api';
import { useAuth } from '../components/context/AuthContext';

export default function LoginScreen() {
  const [username, setUsername] = useState(''); // State to manage the username input
  const [password, setPassword] = useState(''); // State to manage the password input
  const [isLoading, setIsLoading] = useState(false); // State to manage loading indicator
  const [modalVisible, setModalVisible] = useState(false); // State to manage modal visibility
  const [modalMessage, setModalMessage] = useState(''); // State to manage modal message

  const { login } = useAuth(); // Get the login function from authentication context
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList>>(); // Get the navigation object

  // Handle the login process
  const handleLogin = async () => {
    if (!username || !password) {
      setModalMessage('Por favor, rellena todos los campos.'); // Show error message if fields are empty
      setModalVisible(true);
      return;
    }

    setIsLoading(true); // Show loading indicator
    try {
      const token = await loginUser(username, password); // Call login API
      login({ username }, token); // Use the login function from context
      navigation.navigate('Home'); // Navigate to Home screen on successful login
    } catch (error) {
      setModalMessage('Usuario o contraseña incorrectos.'); // Show error message on login failure
      setModalVisible(true);
    } finally {
      setIsLoading(false); // Hide loading indicator
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


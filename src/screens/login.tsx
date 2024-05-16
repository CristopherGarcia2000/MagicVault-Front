import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import colors from '../styles/colors';
import { DrawerNavigationProp } from '@react-navigation/drawer';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList>>();

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('Home');
    }, 2000);
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
        <ActivityIndicator size="large" color={colors.Gold} />
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
    backgroundColor: colors.GreyNeutral,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: colors.Beige,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.GreyDark,
    padding: 10,
  },
  input: {
    height: 40,
    flex: 1,
    marginLeft: 10,
    color: 'black',
  },
  button: {
    backgroundColor: colors.Gold,
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

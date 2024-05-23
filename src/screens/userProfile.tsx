import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../components/context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import Colors from '../styles/colors';
import { FontAwesome } from '@expo/vector-icons';

const UserProfileScreen = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList>>();

  const handleLogout = () => {
    logout();
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome name="user-circle" size={100} color={Colors.Gold} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Nombre de Usuario:</Text>
        <Text style={styles.value}>{user?.username}</Text>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user?.email}</Text>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.GreyNeutral,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  infoContainer: {
    width: '80%',
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    color: Colors.Gold,
    fontSize: 18,
    marginBottom: 8,
  },
  value: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
  },
  logoutButton: {
    backgroundColor: Colors.Gold,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UserProfileScreen;

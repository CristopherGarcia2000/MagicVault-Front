import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '../components/context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';


const UserProfileScreen = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList>>();

  const handleLogout = () => {
    logout();
    navigation.navigate('Home');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Nombre de Usuario: {user?.username}</Text>
      <Text>Email: {user?.email}</Text>
      <Button title="Cerrar Sesión" onPress={handleLogout} />
    </View>
  );
};

export default UserProfileScreen;
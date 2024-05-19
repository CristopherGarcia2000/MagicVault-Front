import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../styles/colors';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelectedScreen } from './context/selectedScreenContext';

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

  const handlePress = (screen: keyof RootStackParamList) => {
    setSelectedScreen(screen);
    navigation.navigate(screen);
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
    width: '100%'
  },
  buttonBackground: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center'
  },
  selectedButton: {
    backgroundColor: Colors.Gold,
  }
});

export default Footer;

import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';


export default function HeaderLogo(){
    const navigation = useNavigation<DrawerNavigationProp<RootStackParamList>>();
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
      <Image
        source={require('../../assets/logo.png')}
        style={{ width: 40, height: 40 }}
      />
    </TouchableOpacity>
  );
};
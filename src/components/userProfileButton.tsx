import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from './context/AuthContext';

const UserProfileButton = () => {
    const navigation = useNavigation<DrawerNavigationProp<RootStackParamList>>();
    const { isAuthenticated } = useAuth();

    const handlePress = () => {
        if (isAuthenticated) {
            navigation.navigate('UserProfile');
        } else {
            navigation.navigate('Login');
        }
    };


    return (
        
        <TouchableOpacity onPress={handlePress}
                          style={{ margin: 10 }}>
            <MaterialIcons name="account-circle" size={30} color="#DAA520" />
        </TouchableOpacity>
    );
};

export default UserProfileButton;

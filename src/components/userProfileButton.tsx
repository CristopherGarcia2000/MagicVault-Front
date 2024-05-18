import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons';

const UserProfileButton = () => {
    const navigation = useNavigation<DrawerNavigationProp<RootStackParamList>>();

    return (
        <TouchableOpacity onPress={() => navigation.navigate('UserProfile')}
                          style={{ margin: 10 }}>
            <MaterialIcons name="account-circle" size={30} color="#DAA520" />
        </TouchableOpacity>
    );
};

export default UserProfileButton;

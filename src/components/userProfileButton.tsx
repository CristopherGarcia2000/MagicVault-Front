import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from './context/AuthContext';

// UserProfileButton component to navigate to user profile or login screen
const UserProfileButton = () => {
    const navigation = useNavigation<DrawerNavigationProp<RootStackParamList>>(); // Access navigation
    const { isAuthenticated } = useAuth(); // Access authentication state

    // Handle button press
    const handlePress = () => {
        if (isAuthenticated) {
            navigation.navigate('UserProfile'); // Navigate to UserProfile if authenticated
        } else {
            navigation.navigate('Login'); // Navigate to Login if not authenticated
        }
    };

    return (
        <TouchableOpacity onPress={handlePress} style={{ margin: 10 }}>
            <MaterialIcons name="account-circle" size={30} color="#DAA520" />
        </TouchableOpacity>
    );
};

export default UserProfileButton;

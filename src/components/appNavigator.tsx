import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/home';
import LoginScreen from '../screens/login';
import RegisterScreen from '../screens/register';
import SearchScreen from '../screens/search';
import CollectionsScreen from '../screens/colections';
import DecksScreen from '../screens/decks';
import ScannerScreen from '../screens/scanner';
import TabNavigation from './TabNavigation';
import colors from '../styles/colors';
import HeaderLogo from './header';
import UserProfileScreen from '../screens/userProfile';
import UserProfileButton from './userProfileButton';


const Drawer = createDrawerNavigator();

function AppNavigator() {
    
    return (
        <NavigationContainer>
            <Drawer.Navigator
                initialRouteName="Home"
                screenOptions={{
                    drawerStyle: {
                        backgroundColor: colors.GreyNeutral, 
                    },
                    drawerActiveTintColor: colors.Gold, 
                    drawerInactiveTintColor: colors.Beige, 
                    headerStyle: {
                        backgroundColor: colors.GreyDark, 
                    },
                    headerTintColor: colors.Beige,
                    headerTitle: () => <HeaderLogo/>,
                    headerTitleAlign: 'center',
                    headerRight: () => <UserProfileButton/>
                }}
            >
                <Drawer.Screen name="TabNavigator" component={TabNavigation} />
                <Drawer.Screen name="Home" component={HomeScreen} />
                <Drawer.Screen name="Login" component={LoginScreen} />
                <Drawer.Screen name="Register" component={RegisterScreen} />
                <Drawer.Screen name="Search" component={SearchScreen} />
                <Drawer.Screen name="Collections" component={CollectionsScreen} />
                <Drawer.Screen name="Decks" component={DecksScreen} />
                <Drawer.Screen name="Scanner" component={ScannerScreen} />
                <Drawer.Screen name="UserProfile" component={UserProfileScreen} />          

            </Drawer.Navigator>
        </NavigationContainer>
    );
}

export default AppNavigator;

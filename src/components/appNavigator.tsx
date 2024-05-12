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

const Drawer = createDrawerNavigator();

function AppNavigator() {
    return (
        <NavigationContainer>
            <Drawer.Navigator initialRouteName="Home">
                <Drawer.Screen name="TabNavigator" component={TabNavigation} />
                <Drawer.Screen name="Login" component={LoginScreen} />
                <Drawer.Screen name="Register" component={RegisterScreen} />
                <Drawer.Screen name="Search" component={SearchScreen} />
                <Drawer.Screen name="Collections" component={CollectionsScreen} />
                <Drawer.Screen name="Decks" component={DecksScreen} />
                <Drawer.Screen name="Scanner" component={ScannerScreen} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}
export default AppNavigator;

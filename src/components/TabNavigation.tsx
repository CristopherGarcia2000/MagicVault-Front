import React from 'react'
import Collections from '../screens/colections'
import Decks from '../screens/decks'
import Home from '../screens/home'
import Scanner from '../screens/scanner'
import Search from '../screens/search'
import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons'; 
import colors from '../styles/colors'
const Tab = createBottomTabNavigator();

const TabNavigation = () => {
    const tabNavigatorScreenOptions: BottomTabNavigationOptions = {
        headerShown: false,
        tabBarActiveBackgroundColor:colors.beige,
        tabBarActiveTintColor: colors.gold,
        tabBarShowLabel: true,
      }
      const DecksOptions = (): BottomTabNavigationOptions => {
        return ({
          tabBarIcon: () => <MaterialCommunityIcons name="cards" size={24} color="white" />
        })
      }
      const HomeOptions = (): BottomTabNavigationOptions => {
        return ({
          tabBarIcon: () => <Entypo name="emoji-flirt" size={24} color="white" />
        })
      }
      const SearchOptions = (): BottomTabNavigationOptions => {
        return ({
          tabBarIcon: () => <Entypo name="magnifying-glass" size={24} color="white" />
        }) 
    }
    const CollectionOptions = (): BottomTabNavigationOptions => {
        return ({
          tabBarIcon: () => <Entypo name="emoji-flirt" size={24} color="white" />
        }) 
    }
    const ScannerOptions = (): BottomTabNavigationOptions => {
        return ({
          tabBarIcon: () => <Entypo name="emoji-flirt" size={24} color="white" />
        }) 
    }
    return (
            <Tab.Navigator screenOptions={tabNavigatorScreenOptions} >
                <Tab.Screen name='Home' component={Home} options={HomeOptions}/>
                <Tab.Screen name='Search' component={Search} options={SearchOptions}/>
                <Tab.Screen name='Decks' component={Decks} options={DecksOptions}/>
                <Tab.Screen name='Collections' component={Collections} options={CollectionOptions}/>
                <Tab.Screen name='Scanner' component={Scanner} options={ScannerOptions}/>
            </Tab.Navigator>
    )
}

export default TabNavigation
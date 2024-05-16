import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/home';
import LoginScreen from '../screens/login';
import RegisterScreen from '../screens/register';
import SearchScreen from '../screens/search';
import CollectionsScreen from '../screens/colections';
import DecksScreen from '../screens/decks';
import colors from '../styles/colors';
import HeaderLogo from './header';
import UserProfileScreen from '../screens/userProfile';
import UserProfileButton from './userProfileButton';
import Footer from './footer';
import { SelectedScreenProvider, useSelectedScreen } from '../components/context/selectedScreenContext';

const Drawer = createDrawerNavigator();

function AppNavigator() {
  const { setSelectedScreen } = useSelectedScreen();

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
        screenListeners={({ route }) => ({
          state: (e) => {
            const currentRoute = e.data.state.routes[e.data.state.index];
            setSelectedScreen(currentRoute.name);
          }
        })}
      >
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Login" component={LoginScreen} />
        <Drawer.Screen name="Register" component={RegisterScreen} />
        <Drawer.Screen name="Search" component={SearchScreen} />
        <Drawer.Screen name="Collections" component={CollectionsScreen} />
        <Drawer.Screen name="Decks" component={DecksScreen} />
        <Drawer.Screen name="UserProfile" component={UserProfileScreen}
          options={{
            drawerItemStyle: { display: 'none' }
          }} />   
      </Drawer.Navigator>
      <Footer />
    </NavigationContainer>
  );
}

const App = () => (
  <SelectedScreenProvider>
    <AppNavigator />
  </SelectedScreenProvider>
);

export default App;

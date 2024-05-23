import React, { useEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator, DrawerNavigationProp } from '@react-navigation/drawer';
import { Alert } from 'react-native';
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
import { useAuth } from './context/AuthContext';

const Drawer = createDrawerNavigator();

const AppNavigator: React.FC = () => {
  const { setSelectedScreen } = useSelectedScreen();
  const { isAuthenticated } = useAuth();

  const handleNavigation = (navigation: DrawerNavigationProp<any>, screenName: string) => {
    if (!isAuthenticated && (screenName === 'Decks' || screenName === 'Collections')) {
      Alert.alert('Acceso restringido', 'Por favor, inicia sesión o regístrate para acceder a esta sección.');
      return;
    }
    navigation.navigate(screenName);
  };

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
          headerTitle: () => <HeaderLogo />,
          headerTitleAlign: 'center',
          headerRight: () => <UserProfileButton />,
        }}
        screenListeners={({ navigation }) => ({
          state: (e: any) => {
            const currentRoute = e.data.state.routes[e.data.state.index];
            setSelectedScreen(currentRoute.name);
          },
          tabPress: (e: { target: { name: any; }; preventDefault: () => void; }) => {
            const screenName = e.target?.name;
            if (screenName) {
              handleNavigation(navigation, screenName);
              e.preventDefault();
            }
          },
        })}
      >
        <Drawer.Screen name="Home" component={HomeScreen} />
        {isAuthenticated ? (
          <>
            <Drawer.Screen name="UserProfile" component={UserProfileScreen} />
            <Drawer.Screen name="Collections" component={CollectionsScreen} />
            <Drawer.Screen name="Decks" component={DecksScreen} />
          </>
        ) : (
          <>
            <Drawer.Screen name="Login" component={LoginScreen} />
            <Drawer.Screen name="Register" component={RegisterScreen} />
          </>
        )}
        <Drawer.Screen name="Search" component={SearchScreen} />
      </Drawer.Navigator>
      <Footer />
    </NavigationContainer>
  );
};

const App: React.FC = () => (
  <SelectedScreenProvider>
    <AppNavigator />
  </SelectedScreenProvider>
);

export default App;

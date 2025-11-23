import React, { useEffect } from 'react';
import { NavigationContainer, DarkTheme as NavDarkTheme, DefaultTheme as NavDefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';

// Redux
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { loadUserFromStorage } from '../redux/authSlice';
import { loadTheme } from '../redux/themeSlice';

// Types
import { RootStackParamList, MainTabParamList } from '../types';
import { COLORS } from '../constants/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Bottom Tab Navigator
const MainTabs: React.FC = () => {
  const themeMode = useAppSelector((state) => state.theme.mode);
  const colors = COLORS[themeMode];

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="heart" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

// Root Navigator
const AppNavigator: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const themeMode = useAppSelector((state) => state.theme.mode);
  const colors = COLORS[themeMode];
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      await dispatch(loadUserFromStorage());
      await dispatch(loadTheme());
      setIsLoading(false);
    };

    initializeApp();
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Build a navigation theme that uses your COLORS mapping
  const navTheme = {
    ...(themeMode === 'dark' ? NavDarkTheme : NavDefaultTheme),
    colors: {
      ...(themeMode === 'dark' ? NavDarkTheme.colors : NavDefaultTheme.colors),
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      {/* StatusBar adapts to the selected theme */}
      <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} backgroundColor={colors.card} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated || !user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="Details" component={DetailsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
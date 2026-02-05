import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import HomeScreen from '../screens/HomeScreen';
import CityWeatherScreen from '../screens/CityWeatherScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const darkTheme = useSelector((state) => state.settings.darkTheme);

  // theme colors for light/dark mode
  const theme = {
    dark: darkTheme,
    colors: {
      primary: '#007AFF',
      background: darkTheme ? '#1C1C1E' : '#FFFFFF',
      card: darkTheme ? '#2C2C2E' : '#FFFFFF',
      text: darkTheme ? '#FFFFFF' : '#000000',
      border: darkTheme ? '#3A3A3C' : '#E5E5EA',
      notification: '#FF3B30',
    },
    fonts: {
      regular: { fontFamily: 'System', fontWeight: 'normal' },
      medium: { fontFamily: 'System', fontWeight: '500' },
      bold: { fontFamily: 'System', fontWeight: 'bold' },
      heavy: { fontFamily: 'System', fontWeight: '800' },
    },
  };

  const screenOptions = {
    headerStyle: { backgroundColor: darkTheme ? '#1C1C1E' : '#FFFFFF' },
    headerTintColor: darkTheme ? '#FFFFFF' : '#000000',
    headerTitleStyle: { fontWeight: '600' },
    contentStyle: { backgroundColor: darkTheme ? '#1C1C1E' : '#F2F2F7' },
    headerShadowVisible: false,
  };

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CityWeather"
          component={CityWeatherScreen}
          options={({ route }) => ({
            title: `${route.params.name}, ${route.params.country}`,
          })}
        />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

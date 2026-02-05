import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { removeFavorite, updateFavoriteWeather } from '../store/favoritesSlice';
import { fetchCurrentWeather } from '../services/api';
import { getWeatherDescription, getWeatherIcon } from '../utils/weatherCodes';
import { formatTemperature, getTemperatureUnit } from '../utils/helpers';

const FavoritesScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { cities: favorites } = useSelector((state) => state.favorites);
  const { temperatureUnit, darkTheme } = useSelector((state) => state.settings);

  const styles = createStyles(darkTheme);

  const fetchFavoritesWeather = useCallback(async () => {
    for (const city of favorites) {
      try {
        const weather = await fetchCurrentWeather(city.latitude, city.longitude);
        dispatch(updateFavoriteWeather({ cityId: city.id, weather }));
      } catch (error) {
        console.error('Failed to fetch weather for', city.name, error);
      }
    }
  }, [favorites, dispatch]);

  useEffect(() => {
    fetchFavoritesWeather();
  }, []);

  const handleCityPress = (city) => {
    navigation.navigate('CityWeather', {
      latitude: city.latitude,
      longitude: city.longitude,
      name: city.name,
      country: city.country,
      id: city.id,
      admin1: city.admin1,
    });
  };

  const handleRemoveFavorite = (city) => {
    Alert.alert(
      'Remove Favorite',
      `Are you sure you want to remove ${city.name} from favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => dispatch(removeFavorite(city.id)),
        },
      ]
    );
  };

  const renderFavoriteItem = ({ item }) => {
    const weather = item.currentWeather;

    return (
      <TouchableOpacity
        style={styles.favoriteItem}
        onPress={() => handleCityPress(item)}
        onLongPress={() => handleRemoveFavorite(item)}
      >
        <View style={styles.favoriteInfo}>
          <Text style={styles.cityName}>{item.name}, {item.country}</Text>
          {weather ? (
            <Text style={styles.weatherDescription}>
              {getWeatherDescription(weather.weatherCode)}
            </Text>
          ) : (
            <ActivityIndicator size="small" color="#8E8E93" />
          )}
        </View>
        <View style={styles.favoriteWeather}>
          {weather ? (
            <>
              <Text style={styles.temperature}>
                {formatTemperature(weather.temperature, temperatureUnit)}°{getTemperatureUnit(temperatureUnit)}
              </Text>
              <MaterialCommunityIcons
                name={getWeatherIcon(weather.weatherCode)}
                size={28}
                color="#FFD700"
              />
            </>
          ) : null}
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={darkTheme ? '#8E8E93' : '#C7C7CC'}
        />
      </TouchableOpacity>
    );
  };

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons
          name="star-outline"
          size={64}
          color="#8E8E93"
        />
        <Text style={styles.emptyText}>No favorites yet</Text>
        <Text style={styles.emptySubtext}>
          Search for a city and tap the star icon to add it to favorites
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderFavoriteItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <Text style={styles.hint}>Long press to remove</Text>
    </View>
  );
};

const createStyles = (darkTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: darkTheme ? '#1C1C1E' : '#F2F2F7',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: darkTheme ? '#1C1C1E' : '#F2F2F7',
      paddingHorizontal: 40,
    },
    emptyText: {
      fontSize: 20,
      fontWeight: '600',
      color: darkTheme ? '#FFFFFF' : '#000000',
      marginTop: 16,
    },
    emptySubtext: {
      fontSize: 15,
      color: '#8E8E93',
      textAlign: 'center',
      marginTop: 8,
      lineHeight: 22,
    },
    listContent: {
      padding: 16,
    },
    favoriteItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: darkTheme ? '#2C2C2E' : '#FFFFFF',
      borderRadius: 12,
      padding: 16,
    },
    favoriteInfo: {
      flex: 1,
    },
    cityName: {
      fontSize: 17,
      fontWeight: '600',
      color: darkTheme ? '#FFFFFF' : '#000000',
    },
    weatherDescription: {
      fontSize: 14,
      color: '#8E8E93',
      marginTop: 4,
    },
    favoriteWeather: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 8,
    },
    temperature: {
      fontSize: 22,
      fontWeight: '500',
      color: darkTheme ? '#FFFFFF' : '#000000',
      marginRight: 8,
    },
    separator: {
      height: 10,
    },
    hint: {
      textAlign: 'center',
      color: '#8E8E93',
      fontSize: 13,
      paddingVertical: 16,
    },
  });

export default FavoritesScreen;

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { searchLocations, clearSearchResults } from '../store/weatherSlice';
import { fetchCurrentWeather } from '../services/api';
import { updateFavoriteWeather } from '../store/favoritesSlice';
import { getWeatherDescription, getWeatherIcon } from '../utils/weatherCodes';
import { formatTemperature, getTemperatureUnit } from '../utils/helpers';

const CARD_COLORS = ['#4A6FA5', '#5B8C5A', '#8B6BB1', '#C47E3F', '#5A8E9E', '#9E5A5A'];

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const { searchResults, searchLoading } = useSelector((state) => state.weather);
  const { cities: favorites } = useSelector((state) => state.favorites);
  const { temperatureUnit, darkTheme } = useSelector((state) => state.settings);

  const styles = createStyles(darkTheme);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2) {
        dispatch(searchLocations(searchQuery));
      } else {
        dispatch(clearSearchResults());
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, dispatch]);

  // Fetch current weather for favorites
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

  // Refresh favorites weather when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchFavoritesWeather();
    });
    return unsubscribe;
  }, [navigation, fetchFavoritesWeather]);

  const handleCityPress = (city) => {
    setSearchQuery('');
    dispatch(clearSearchResults());
    navigation.navigate('CityWeather', {
      latitude: city.latitude,
      longitude: city.longitude,
      name: city.name,
      country: city.country_code || city.country,
      id: city.id,
      admin1: city.admin1,
    });
  };

  const renderSearchResult = ({ item }) => (
    <TouchableOpacity
      style={styles.searchResultItem}
      onPress={() => handleCityPress(item)}
    >
      <View style={styles.searchResultInfo}>
        <Text style={styles.searchResultCity}>
          {item.name}, {item.country_code || item.country}
        </Text>
        {item.admin1 && (
          <Text style={styles.searchResultAdmin}>{item.admin1}</Text>
        )}
      </View>
      <MaterialCommunityIcons
        name="chevron-right"
        size={24}
        color={darkTheme ? '#8E8E93' : '#C7C7CC'}
      />
    </TouchableOpacity>
  );

  const renderFavoriteCard = (city, index) => {
    const weather = city.currentWeather;
    const bgColor = CARD_COLORS[index % CARD_COLORS.length];
    return (
      <TouchableOpacity
        key={city.id}
        style={[styles.favoriteCard, { backgroundColor: bgColor }]}
        onPress={() => handleCityPress(city)}
      >
        <Text style={styles.favoriteCityName}>{city.name},</Text>
        <Text style={styles.favoriteCountryCode}>{city.country}</Text>
        {weather ? (
          <>
            <Text style={styles.favoriteTemp}>
              {formatTemperature(weather.temperature, temperatureUnit)}°{getTemperatureUnit(temperatureUnit)}
            </Text>
            <MaterialCommunityIcons
              name={getWeatherIcon(weather.weatherCode)}
              size={22}
              color="rgba(255,255,255,0.8)"
            />
            <Text style={styles.favoriteDescription}>
              {getWeatherDescription(weather.weatherCode)}
            </Text>
          </>
        ) : (
          <ActivityIndicator size="small" color="#FFFFFF" style={{ marginTop: 8 }} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SkyCast</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <MaterialCommunityIcons
            name="cog-outline"
            size={28}
            color={darkTheme ? '#FFFFFF' : '#000000'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <MaterialCommunityIcons
          name="magnify"
          size={20}
          color="#8E8E93"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search city or place..."
          placeholderTextColor="#8E8E93"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialCommunityIcons name="close-circle" size={20} color="#8E8E93" />
          </TouchableOpacity>
        )}
      </View>

      {searchQuery.length >= 2 && (
        <View style={styles.searchResultsContainer}>
          {searchLoading ? (
            <ActivityIndicator size="small" color="#007AFF" style={styles.loader} />
          ) : searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderSearchResult}
              style={styles.searchResultsList}
            />
          ) : (
            <Text style={styles.noResults}>No cities found</Text>
          )}
        </View>
      )}

      {searchQuery.length < 2 && (
        <ScrollView style={styles.belowSearch} contentContainerStyle={styles.belowSearchContent}>
          {favorites.length > 0 && (
            <View style={styles.favoritesSection}>
              <TouchableOpacity
                style={styles.favoritesHeader}
                onPress={() => navigation.navigate('Favorites')}
              >
                <Text style={styles.favoritesTitle}>Favorites</Text>
              </TouchableOpacity>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.favoritesScroll}
              >
                {favorites.map((city, index) => renderFavoriteCard(city, index))}
              </ScrollView>
            </View>
          )}

          <View style={styles.hintContainer}>
            <MaterialCommunityIcons
              name="weather-cloudy"
              size={48}
              color="#C7C7CC"
            />
            <Text style={styles.hintText}>Type a city name to search</Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const createStyles = (darkTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: darkTheme ? '#1C1C1E' : '#FFFFFF',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 15,
    },
    title: {
      fontSize: 34,
      fontWeight: 'bold',
      color: darkTheme ? '#FFFFFF' : '#000000',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: darkTheme ? '#2C2C2E' : '#F2F2F7',
      marginHorizontal: 20,
      paddingHorizontal: 12,
      borderRadius: 12,
      height: 44,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 17,
      color: darkTheme ? '#FFFFFF' : '#000000',
    },
    searchResultsContainer: {
      marginHorizontal: 20,
      marginTop: 10,
      backgroundColor: darkTheme ? '#2C2C2E' : '#FFFFFF',
      borderRadius: 12,
      maxHeight: 300,
      borderWidth: 1,
      borderColor: darkTheme ? '#3A3A3C' : '#E5E5EA',
    },
    searchResultsList: {
      borderRadius: 12,
    },
    searchResultItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: darkTheme ? '#3A3A3C' : '#E5E5EA',
    },
    searchResultInfo: {
      flex: 1,
    },
    searchResultCity: {
      fontSize: 17,
      color: darkTheme ? '#FFFFFF' : '#000000',
      fontWeight: '400',
    },
    searchResultAdmin: {
      fontSize: 13,
      color: '#8E8E93',
      marginTop: 2,
    },
    loader: {
      padding: 20,
    },
    noResults: {
      padding: 20,
      textAlign: 'center',
      color: '#8E8E93',
      fontSize: 15,
    },
    favoritesSection: {
      marginTop: 24,
    },
    favoritesHeader: {
      paddingHorizontal: 20,
      marginBottom: 12,
    },
    favoritesTitle: {
      fontSize: 22,
      fontWeight: '600',
      color: darkTheme ? '#FFFFFF' : '#000000',
    },
    favoritesScroll: {
      paddingHorizontal: 20,
    },
    favoriteCard: {
      borderRadius: 16,
      paddingVertical: 14,
      paddingHorizontal: 18,
      marginRight: 12,
      minWidth: 110,
      alignItems: 'center',
    },
    favoriteCityName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
      textAlign: 'center',
    },
    favoriteCountryCode: {
      fontSize: 14,
      color: 'rgba(255,255,255,0.8)',
      marginTop: 1,
    },
    favoriteTemp: {
      fontSize: 22,
      fontWeight: '600',
      color: '#FFFFFF',
      marginTop: 6,
    },
    favoriteDescription: {
      fontSize: 12,
      color: 'rgba(255,255,255,0.7)',
      marginTop: 4,
      textAlign: 'center',
    },
    belowSearch: {
      flex: 1,
    },
    belowSearchContent: {
      flexGrow: 1,
    },
    hintContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
    },
    hintText: {
      fontSize: 15,
      color: '#8E8E93',
      marginTop: 12,
    },
  });

export default HomeScreen;

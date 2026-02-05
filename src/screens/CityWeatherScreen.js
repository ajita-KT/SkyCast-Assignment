import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getWeather, clearWeather } from '../store/weatherSlice';
import { addFavorite, removeFavorite } from '../store/favoritesSlice';
import { getWeatherDescription, getWeatherIcon } from '../utils/weatherCodes';
import {
  formatTemperature,
  getTemperatureUnit,
  formatWindSpeed,
  formatTime,
  formatSunTime,
  getDayName,
  isToday,
} from '../utils/helpers';

const CityWeatherScreen = ({ route, navigation }) => {
  const { latitude, longitude, name, country, id, admin1 } = route.params;
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('today');

  const { currentWeather, hourlyForecast, dailyForecast, loading, error } = useSelector(
    (state) => state.weather
  );
  const { cities: favorites } = useSelector((state) => state.favorites);
  const { temperatureUnit, windSpeedUnit, darkTheme } = useSelector(
    (state) => state.settings
  );

  const isFavorite = favorites.some((city) => city.id === id);
  const styles = createStyles(darkTheme);

  useEffect(() => {
    dispatch(getWeather({ latitude, longitude }));
    return () => dispatch(clearWeather());
  }, [latitude, longitude, dispatch]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleToggleFavorite}
          style={{ padding: 8 }}
        >
          <MaterialCommunityIcons
            name={isFavorite ? 'star' : 'star-outline'}
            size={26}
            color={isFavorite ? '#FFD700' : darkTheme ? '#FFFFFF' : '#000000'}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, isFavorite, darkTheme]);

  const handleToggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavorite(id));
    } else {
      dispatch(
        addFavorite({
          id,
          name,
          country,
          latitude,
          longitude,
          admin1,
        })
      );
    }
  };

  const handleRetry = () => {
    dispatch(getWeather({ latitude, longitude }));
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading weather data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <MaterialCommunityIcons
          name="weather-cloudy-alert"
          size={64}
          color="#8E8E93"
        />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!currentWeather) return null;

  const todayData = dailyForecast[0];
  const unitLabel = getTemperatureUnit(temperatureUnit);

  const renderTodayTab = () => (
    <View style={styles.tabContent}>
      {/* Sunrise & Sunset */}
      <View style={styles.sunRow}>
        <View style={styles.sunItem}>
          <MaterialCommunityIcons name="weather-sunset-up" size={36} color="#FFA500" />
          <Text style={styles.sunLabel}>Sunrise</Text>
          <Text style={styles.sunValue}>{formatSunTime(todayData?.sunrise)}</Text>
        </View>
        <View style={styles.sunItem}>
          <MaterialCommunityIcons name="weather-sunset-down" size={36} color="#FF6347" />
          <Text style={styles.sunLabel}>Sunset</Text>
          <Text style={styles.sunValue}>{formatSunTime(todayData?.sunset)}</Text>
        </View>
      </View>

      {/* Today overview */}
      <View style={styles.todayOverview}>
        <Text style={styles.overviewTitle}>Today overview</Text>
        <Text style={styles.overviewText}>
          Min {formatTemperature(todayData?.minTemperature, temperatureUnit)}°{unitLabel} / Max {formatTemperature(todayData?.maxTemperature, temperatureUnit)}°{unitLabel}. Expect {getWeatherDescription(todayData?.weatherCode).toLowerCase()}.
        </Text>
      </View>
    </View>
  );

  const renderHourlyTab = () => (
    <FlatList
      data={hourlyForecast}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.hourlyList}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={styles.hourlyCard}>
          <Text style={styles.hourlyTime}>{formatTime(item.time)}</Text>
          <MaterialCommunityIcons
            name={getWeatherIcon(item.weatherCode)}
            size={28}
            color="#FFD700"
          />
          <Text style={styles.hourlyTemp}>
            {formatTemperature(item.temperature, temperatureUnit)}°
          </Text>
          {item.precipitationProbability > 0 && (
            <View style={styles.hourlyRain}>
              <MaterialCommunityIcons name="water" size={12} color="#007AFF" />
              <Text style={styles.hourlyRainText}>{item.precipitationProbability}%</Text>
            </View>
          )}
        </View>
      )}
    />
  );

  const renderDailyTab = () => (
    <View style={styles.dailyList}>
      {dailyForecast.map((day, index) => (
        <View key={index} style={styles.dailyRow}>
          <Text style={styles.dailyDay}>
            {isToday(day.date) ? 'Today' : getDayName(day.date)}
          </Text>
          <View style={styles.dailyWeather}>
            <MaterialCommunityIcons
              name={getWeatherIcon(day.weatherCode)}
              size={24}
              color="#FFD700"
            />
            {day.precipitationProbability > 0 && (
              <Text style={styles.dailyRain}>{day.precipitationProbability}%</Text>
            )}
          </View>
          <Text style={styles.dailyTemp}>
            {formatTemperature(day.minTemperature, temperatureUnit)}° / {formatTemperature(day.maxTemperature, temperatureUnit)}°
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Current Weather Card */}
      <View style={styles.currentCard}>
        <MaterialCommunityIcons
          name={getWeatherIcon(currentWeather.weatherCode)}
          size={64}
          color="#FFD700"
          style={styles.weatherIcon}
        />
        <Text style={styles.currentTemp}>
          {formatTemperature(currentWeather.temperature, temperatureUnit)}°{unitLabel}
        </Text>
        <Text style={styles.currentDescription}>
          {getWeatherDescription(currentWeather.weatherCode)}
        </Text>
        <Text style={styles.feelsLike}>
          Feels like {formatTemperature(currentWeather.apparentTemperature, temperatureUnit)}°{unitLabel}
        </Text>

        <View style={styles.currentDetails}>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="weather-windy" size={24} color={darkTheme ? '#8E8E93' : '#555'} />
            <Text style={styles.detailLabel}>Wind</Text>
            <Text style={styles.detailValue}>
              {formatWindSpeed(currentWeather.windSpeed, windSpeedUnit)}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="water-percent" size={24} color={darkTheme ? '#8E8E93' : '#555'} />
            <Text style={styles.detailLabel}>Humidity</Text>
            <Text style={styles.detailValue}>{currentWeather.humidity}%</Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="umbrella-outline" size={24} color={darkTheme ? '#8E8E93' : '#555'} />
            <Text style={styles.detailLabel}>Chance of rain</Text>
            <Text style={styles.detailValue}>
              {todayData?.precipitationProbability || 0}%
            </Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {['today', 'hourly', 'daily'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[styles.tabText, activeTab === tab && styles.activeTabText]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      {activeTab === 'today' && renderTodayTab()}
      {activeTab === 'hourly' && renderHourlyTab()}
      {activeTab === 'daily' && renderDailyTab()}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

const createStyles = (darkTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: darkTheme ? '#1C1C1E' : '#F2F2F7',
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: darkTheme ? '#1C1C1E' : '#F2F2F7',
    },
    loadingText: {
      marginTop: 16,
      fontSize: 17,
      color: '#8E8E93',
    },
    errorText: {
      marginTop: 16,
      fontSize: 17,
      color: '#8E8E93',
      textAlign: 'center',
      paddingHorizontal: 40,
    },
    retryButton: {
      marginTop: 20,
      backgroundColor: '#007AFF',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 10,
    },
    retryButtonText: {
      color: '#FFFFFF',
      fontSize: 17,
      fontWeight: '600',
    },
    currentCard: {
      backgroundColor: darkTheme ? '#2C2C2E' : '#FFFFFF',
      margin: 16,
      borderRadius: 20,
      padding: 24,
      alignItems: 'center',
    },
    weatherIcon: {
      marginBottom: 8,
    },
    currentTemp: {
      fontSize: 64,
      fontWeight: '300',
      color: darkTheme ? '#FFFFFF' : '#000000',
    },
    currentDescription: {
      fontSize: 18,
      color: '#8E8E93',
      marginTop: 2,
    },
    feelsLike: {
      fontSize: 14,
      color: '#8E8E93',
      marginTop: 4,
    },
    currentDetails: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      marginTop: 24,
      paddingTop: 20,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: darkTheme ? '#3A3A3C' : '#E5E5EA',
    },
    detailItem: {
      alignItems: 'center',
    },
    detailLabel: {
      fontSize: 12,
      color: '#8E8E93',
      marginTop: 4,
    },
    detailValue: {
      fontSize: 15,
      fontWeight: '600',
      color: darkTheme ? '#FFFFFF' : '#000000',
      marginTop: 2,
    },
    tabBar: {
      flexDirection: 'row',
      marginHorizontal: 16,
      backgroundColor: darkTheme ? '#2C2C2E' : '#FFFFFF',
      borderRadius: 12,
      padding: 4,
    },
    tab: {
      flex: 1,
      paddingVertical: 10,
      alignItems: 'center',
      borderRadius: 10,
    },
    activeTab: {
      backgroundColor: darkTheme ? '#3A3A3C' : '#F2F2F7',
    },
    tabText: {
      fontSize: 15,
      color: '#8E8E93',
      fontWeight: '500',
    },
    activeTabText: {
      color: darkTheme ? '#FFFFFF' : '#000000',
      fontWeight: '600',
    },
    tabContent: {
      margin: 16,
    },
    sunRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: darkTheme ? '#2C2C2E' : '#FFFFFF',
      borderRadius: 16,
      paddingVertical: 20,
    },
    sunItem: {
      alignItems: 'center',
    },
    sunLabel: {
      fontSize: 13,
      color: '#8E8E93',
      marginTop: 6,
    },
    sunValue: {
      fontSize: 18,
      fontWeight: '600',
      color: darkTheme ? '#FFFFFF' : '#000000',
      marginTop: 2,
    },
    todayOverview: {
      backgroundColor: darkTheme ? '#2C2C2E' : '#FFFFFF',
      borderRadius: 16,
      padding: 16,
      marginTop: 12,
    },
    overviewTitle: {
      fontSize: 17,
      fontWeight: '600',
      color: darkTheme ? '#FFFFFF' : '#000000',
      marginBottom: 8,
    },
    overviewText: {
      fontSize: 15,
      color: '#8E8E93',
      lineHeight: 22,
    },
    hourlyList: {
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    hourlyCard: {
      backgroundColor: darkTheme ? '#2C2C2E' : '#FFFFFF',
      borderRadius: 16,
      padding: 12,
      marginRight: 10,
      alignItems: 'center',
      minWidth: 72,
    },
    hourlyTime: {
      fontSize: 13,
      color: '#8E8E93',
      marginBottom: 8,
    },
    hourlyTemp: {
      fontSize: 17,
      fontWeight: '600',
      color: darkTheme ? '#FFFFFF' : '#000000',
      marginTop: 8,
    },
    hourlyRain: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
    },
    hourlyRainText: {
      fontSize: 11,
      color: '#007AFF',
      marginLeft: 2,
    },
    dailyList: {
      backgroundColor: darkTheme ? '#2C2C2E' : '#FFFFFF',
      borderRadius: 16,
      marginHorizontal: 16,
      marginTop: 16,
    },
    dailyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: darkTheme ? '#3A3A3C' : '#E5E5EA',
    },
    dailyDay: {
      flex: 1,
      fontSize: 15,
      fontWeight: '500',
      color: darkTheme ? '#FFFFFF' : '#000000',
    },
    dailyWeather: {
      flexDirection: 'row',
      alignItems: 'center',
      width: 60,
    },
    dailyRain: {
      fontSize: 13,
      color: '#007AFF',
      marginLeft: 4,
    },
    dailyTemp: {
      fontSize: 15,
      color: darkTheme ? '#FFFFFF' : '#000000',
      textAlign: 'right',
      width: 100,
    },
  });

export default CityWeatherScreen;

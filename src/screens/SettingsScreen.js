import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
  setTemperatureUnit,
  setWindSpeedUnit,
  toggleDarkTheme,
} from '../store/settingsSlice';

const SettingsScreen = () => {
  const dispatch = useDispatch();
  const { temperatureUnit, windSpeedUnit, darkTheme } = useSelector(
    (state) => state.settings
  );

  const styles = createStyles(darkTheme);

  const SettingRow = ({ icon, label, children }) => (
    <View style={styles.settingRow}>
      <View style={styles.settingLabel}>
        <MaterialCommunityIcons
          name={icon}
          size={22}
          color="#007AFF"
          style={styles.settingIcon}
        />
        <Text style={styles.settingText}>{label}</Text>
      </View>
      <View style={styles.settingControl}>{children}</View>
    </View>
  );

  const ToggleButton = ({ options, value, onChange }) => (
    <View style={styles.toggleContainer}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.toggleButton,
            value === option.value && styles.toggleButtonActive,
          ]}
          onPress={() => onChange(option.value)}
        >
          <Text
            style={[
              styles.toggleButtonText,
              value === option.value && styles.toggleButtonTextActive,
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Units Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Units</Text>
        <View style={styles.sectionContent}>
          <SettingRow icon="thermometer" label="Temperature">
            <ToggleButton
              options={[
                { value: 'celsius', label: '°C' },
                { value: 'fahrenheit', label: '°F' },
              ]}
              value={temperatureUnit}
              onChange={(value) => dispatch(setTemperatureUnit(value))}
            />
          </SettingRow>
          <View style={styles.divider} />
          <SettingRow icon="weather-windy" label="Wind speed">
            <ToggleButton
              options={[
                { value: 'kmh', label: 'km/h' },
                { value: 'mph', label: 'mph' },
              ]}
              value={windSpeedUnit}
              onChange={(value) => dispatch(setWindSpeedUnit(value))}
            />
          </SettingRow>
        </View>
      </View>

      {/* Appearance Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Appearance</Text>
        <View style={styles.sectionContent}>
          <SettingRow icon="theme-light-dark" label="Dark theme">
            <Switch
              value={darkTheme}
              onValueChange={() => dispatch(toggleDarkTheme())}
              trackColor={{ false: '#E5E5EA', true: '#34C759' }}
              thumbColor="#FFFFFF"
            />
          </SettingRow>
        </View>
      </View>

      {/* App Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>App</Text>
        <View style={styles.sectionContent}>
          <View style={styles.aboutRow}>
            <MaterialCommunityIcons
              name="information-outline"
              size={22}
              color="#007AFF"
              style={styles.settingIcon}
            />
            <View style={styles.aboutContent}>
              <Text style={styles.aboutTitle}>About SkyCast</Text>
              <Text style={styles.aboutDescription}>
                A simple and accurate weather app.
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Credits */}
      <View style={styles.credits}>
        <Text style={styles.creditsText}>
          Weather data provided by Open-Meteo
        </Text>
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const createStyles = (darkTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: darkTheme ? '#1C1C1E' : '#F2F2F7',
    },
    section: {
      marginTop: 24,
    },
    sectionHeader: {
      fontSize: 13,
      fontWeight: '600',
      color: '#8E8E93',
      textTransform: 'uppercase',
      marginLeft: 20,
      marginBottom: 8,
    },
    sectionContent: {
      backgroundColor: darkTheme ? '#2C2C2E' : '#FFFFFF',
      borderRadius: 12,
      marginHorizontal: 16,
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    settingLabel: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    settingIcon: {
      marginRight: 12,
    },
    settingText: {
      fontSize: 17,
      color: darkTheme ? '#FFFFFF' : '#000000',
    },
    settingControl: {},
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: darkTheme ? '#3A3A3C' : '#E5E5EA',
      marginLeft: 50,
    },
    toggleContainer: {
      flexDirection: 'row',
      backgroundColor: darkTheme ? '#3A3A3C' : '#E5E5EA',
      borderRadius: 8,
      padding: 2,
    },
    toggleButton: {
      paddingVertical: 6,
      paddingHorizontal: 14,
      borderRadius: 6,
    },
    toggleButtonActive: {
      backgroundColor: darkTheme ? '#007AFF' : '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    toggleButtonText: {
      fontSize: 14,
      color: '#8E8E93',
      fontWeight: '500',
    },
    toggleButtonTextActive: {
      color: darkTheme ? '#FFFFFF' : '#000000',
    },
    aboutRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    aboutContent: {
      flex: 1,
    },
    aboutTitle: {
      fontSize: 17,
      color: darkTheme ? '#FFFFFF' : '#000000',
    },
    aboutDescription: {
      fontSize: 14,
      color: '#8E8E93',
      marginTop: 2,
    },
    credits: {
      alignItems: 'center',
      paddingVertical: 32,
    },
    creditsText: {
      fontSize: 13,
      color: '#8E8E93',
    },
    versionText: {
      fontSize: 13,
      color: '#8E8E93',
      marginTop: 4,
    },
  });

export default SettingsScreen;

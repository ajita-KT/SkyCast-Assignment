# SkyCast

A simple weather app I built to learn React Native and Redux. Shows current weather, hourly/daily forecasts, and lets you save favorite cities.

## What it does

- Search for any city and get the weather
- See current temp, humidity, wind, and rain chance
- Hourly forecast for the next 24 hours
- 10-day forecast
- Save cities to favorites for quick access
- Switch between Celsius/Fahrenheit
- Dark mode

## Tech used

- React Native with Expo
- Redux Toolkit for state
- Open-Meteo API (free, no key needed)
- AsyncStorage to save favorites

## Setup

```bash
npm install
npx expo start
```

Then press `w` for web or scan the QR code with Expo Go on your phone.

## Project structure

```
src/
  screens/       - All the screens (Home, Weather, Favorites, Settings)
  store/         - Redux slices for weather, favorites, and settings
  services/      - API calls to Open-Meteo
  utils/         - Helper functions for formatting temps and dates
  navigation/    - React Navigation setup
```

## How it works

### Searching cities
When you type in the search box, it waits 300ms after you stop typing (debounce) then hits the Open-Meteo geocoding API. Results show city name, country, and region.

### Weather data
Tapping a city fetches weather from Open-Meteo's forecast API. The response includes current conditions plus hourly and daily arrays. I map the WMO weather codes to readable descriptions and icons.

### Favorites
Click the star on any city's weather page to save it. Favorites are stored in Redux and persisted to AsyncStorage so they survive app restarts. The home screen shows favorite cards with live temps.

### Settings
Temperature and wind speed units are stored in Redux. When you toggle them, all screens update instantly since they're all reading from the same state.

## API

Using [Open-Meteo](https://open-meteo.com/) - it's free and doesn't need an API key.

- Geocoding: `https://geocoding-api.open-meteo.com/v1/search`
- Weather: `https://api.open-meteo.com/v1/forecast`

## Notes

- Temps from the API are always in Celsius, I convert to Fahrenheit on the client
- Weather codes follow the WMO standard - see `weatherCodes.js` for the mapping
- Only favorites and settings get persisted, weather data is always fetched fresh

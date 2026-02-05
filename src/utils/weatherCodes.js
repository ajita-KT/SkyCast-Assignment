// WMO weather codes -> human readable text and icons
// ref: https://open-meteo.com/en/docs

export const weatherCodes = {
  0: { description: 'Clear sky', icon: 'weather-sunny' },
  1: { description: 'Mainly clear', icon: 'weather-sunny' },
  2: { description: 'Partly cloudy', icon: 'weather-partly-cloudy' },
  3: { description: 'Overcast', icon: 'weather-cloudy' },
  45: { description: 'Fog', icon: 'weather-fog' },
  48: { description: 'Depositing rime fog', icon: 'weather-fog' },
  51: { description: 'Light drizzle', icon: 'weather-rainy' },
  53: { description: 'Moderate drizzle', icon: 'weather-rainy' },
  55: { description: 'Dense drizzle', icon: 'weather-rainy' },
  56: { description: 'Light freezing drizzle', icon: 'weather-snowy-rainy' },
  57: { description: 'Dense freezing drizzle', icon: 'weather-snowy-rainy' },
  61: { description: 'Slight rain', icon: 'weather-rainy' },
  63: { description: 'Moderate rain', icon: 'weather-rainy' },
  65: { description: 'Heavy rain', icon: 'weather-pouring' },
  66: { description: 'Light freezing rain', icon: 'weather-snowy-rainy' },
  67: { description: 'Heavy freezing rain', icon: 'weather-snowy-rainy' },
  71: { description: 'Slight snow fall', icon: 'weather-snowy' },
  73: { description: 'Moderate snow fall', icon: 'weather-snowy' },
  75: { description: 'Heavy snow fall', icon: 'weather-snowy-heavy' },
  77: { description: 'Snow grains', icon: 'weather-snowy' },
  80: { description: 'Slight rain showers', icon: 'weather-rainy' },
  81: { description: 'Moderate rain showers', icon: 'weather-rainy' },
  82: { description: 'Violent rain showers', icon: 'weather-pouring' },
  85: { description: 'Slight snow showers', icon: 'weather-snowy' },
  86: { description: 'Heavy snow showers', icon: 'weather-snowy-heavy' },
  95: { description: 'Thunderstorm', icon: 'weather-lightning' },
  96: { description: 'Thunderstorm with slight hail', icon: 'weather-lightning-rainy' },
  99: { description: 'Thunderstorm with heavy hail', icon: 'weather-lightning-rainy' },
};

export function getWeatherInfo(code) {
  return weatherCodes[code] || { description: 'Unknown', icon: 'weather-cloudy' };
}

export function getWeatherDescription(code) {
  return getWeatherInfo(code).description;
}

export function getWeatherIcon(code) {
  return getWeatherInfo(code).icon;
}

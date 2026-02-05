// Open-Meteo API - free and no API key needed!
const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

// Search for cities by name
export const searchCities = async (query) => {
  // need at least 2 chars to search
  if (!query || query.length < 2) return [];

  const url = `${GEOCODING_API}?name=${encodeURIComponent(query)}&count=10&language=en&format=json`;

  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to search cities');

  const data = await response.json();
  return data.results || [];
};

// Get full weather data for a location
export const fetchWeather = async (latitude, longitude) => {
  // build the params - API needs these specific field names
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'weather_code',
      'wind_speed_10m',
      'precipitation',
    ].join(','),
    hourly: [
      'temperature_2m',
      'weather_code',
      'precipitation_probability',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'sunrise',
      'sunset',
      'precipitation_sum',
      'precipitation_probability_max',
    ].join(','),
    timezone: 'auto',
    forecast_days: '10',
  });

  const response = await fetch(`${WEATHER_API}?${params.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch weather data');

  const data = await response.json();

  // reshape the response into something easier to work with
  return {
    current: {
      temperature: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      apparentTemperature: data.current.apparent_temperature,
      weatherCode: data.current.weather_code,
      windSpeed: data.current.wind_speed_10m,
      precipitation: data.current.precipitation,
    },
    // just grab next 24 hours
    hourly: data.hourly.time.slice(0, 24).map((time, i) => ({
      time,
      temperature: data.hourly.temperature_2m[i],
      weatherCode: data.hourly.weather_code[i],
      precipitationProbability: data.hourly.precipitation_probability[i],
    })),
    daily: data.daily.time.map((date, i) => ({
      date,
      maxTemperature: data.daily.temperature_2m_max[i],
      minTemperature: data.daily.temperature_2m_min[i],
      weatherCode: data.daily.weather_code[i],
      sunrise: data.daily.sunrise[i],
      sunset: data.daily.sunset[i],
      precipitationSum: data.daily.precipitation_sum[i],
      precipitationProbability: data.daily.precipitation_probability_max[i],
    })),
  };
};

// lighter version - just for showing temp on favorite cards
export const fetchCurrentWeather = async (latitude, longitude) => {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: 'temperature_2m,weather_code',
    timezone: 'auto',
  });

  const response = await fetch(`${WEATHER_API}?${params.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch current weather');

  const data = await response.json();
  return {
    temperature: data.current.temperature_2m,
    weatherCode: data.current.weather_code,
  };
};

// Temperature stuff

export function celsiusToFahrenheit(c) {
  return (c * 9) / 5 + 32;
}

export function formatTemperature(tempCelsius, unit) {
  if (unit === 'fahrenheit') {
    return Math.round(celsiusToFahrenheit(tempCelsius));
  }
  return Math.round(tempCelsius);
}

export function getTemperatureUnit(unit) {
  return unit === 'fahrenheit' ? 'F' : 'C';
}

// Wind speed (API gives km/h)

export function kmhToMph(kmh) {
  return kmh * 0.621371;
}

export function formatWindSpeed(speedKmh, unit) {
  if (unit === 'mph') {
    return `${Math.round(kmhToMph(speedKmh))} mph`;
  }
  return `${Math.round(speedKmh)} km/h`;
}

// Date/time formatting

export function formatTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function formatSunTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function getDayName(dateString, short = true) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: short ? 'short' : 'long' });
}

export function isToday(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

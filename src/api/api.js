// src/api/api.js
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

/**
 * 1. Current Weather API
 * Used for Dashboard summary cards.
 * @param {string} city - The city name
 * @param {string} units - 'metric' for Celsius, 'imperial' for Fahrenheit
 */
export const fetchCurrentWeather = async (city, units = 'metric') => {
  const response = await fetch(
    `${BASE_URL}/weather?q=${city}&units=${units}&appid=${API_KEY}`
  );
  if (!response.ok) throw new Error('Failed to fetch current weather');
  return response.json();
};

/**
 * 2. 5-Day Forecast API (3-hour intervals)
 * Used for the Detailed View charts.
 * @param {string} city - The city name
 * @param {string} units - 'metric' for Celsius, 'imperial' for Fahrenheit
 */


export const fetchWeatherForecast = async (city, units = 'metric') => {
  const response = await fetch(
    `${BASE_URL}/forecast?q=${city}&units=${units}&appid=${API_KEY}`
  );
  if (!response.ok) throw new Error('Failed to fetch forecast');
  return response.json();
};


/**
 * 3. Geocoding API for Autocomplete
 * Helps find correct city names/coordinates.
 */
export const fetchCitySuggestions = async (query) => {
  const response = await fetch(
    `${GEO_URL}/direct?q=${query}&limit=5&appid=${API_KEY}`
  );
  if (!response.ok) throw new Error('Failed to fetch city suggestions');
  return response.json();
};
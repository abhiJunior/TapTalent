// src/store/weatherSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCurrentWeather, fetchCitySuggestions, fetchWeatherForecast } from '../api/api.js';
import { LampWallDown } from 'lucide-react';

export const getCitySuggestions = createAsyncThunk(
  'weather/fetchSuggestions',
  async (query, { rejectWithValue }) => {
    try {
      const data = await fetchCitySuggestions(query);
      return data; 
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const getWeatherDetail = createAsyncThunk(
  'weather/fetchDetail',
  async ({ city, unit }, { rejectWithValue }) => {
    try {
      const data = await fetchCurrentWeather(city, unit);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const getForecastDetail = createAsyncThunk(
  "weather/fetchForecast",
  async ({city,unit},{rejectWithValue}) =>{
    try{
      const data = await fetchWeatherForecast(city,unit);
      return {city,data}
    }catch(err){
      return rejectWithValue(err.message)
    }
  }
)

const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    
    // Load favorites from localStorage on startup
    favorites: JSON.parse(localStorage.getItem('favorites')) || [], 
    weatherData: {},
    forecastData: {},
    searchResults: [], 
    lastUpdated : null,
    searchLoading: false,
  },
  reducers: {
    clearSearch: (state) => {
      state.searchResults = [];
    },
   
    // Add this to handle favoriting/unfavoriting
    toggleFavorite: (state, action) => {
      const cityName = action.payload;
      if (state.favorites.includes(cityName)) {
        state.favorites = state.favorites.filter(name => name !== cityName);
      } else {
        state.favorites.push(cityName);
      }
      // Persist to localStorage
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCitySuggestions.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(getCitySuggestions.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(getCitySuggestions.rejected, (state) => {
        state.searchLoading = false;
      })
      .addCase(getWeatherDetail.fulfilled, (state, action) => {
        // Use city name as the key so we don't get duplicates in our dashboard
        state.weatherData[action.payload.name] = {
          ...action.payload,
          timestamp : Date.now()
        }
        state.lastUpdated = Date.now()
      })

      .addCase(getForecastDetail.fulfilled,(state,action)=>{
        state.forecastData[action.payload.city] = action.payload.data;
      })
  }
});

// Export the new actions so they can be used in your components
export const { clearSearch, setUnit, toggleFavorite } = weatherSlice.actions;
export default weatherSlice.reducer;
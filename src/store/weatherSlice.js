import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchWeather, searchCities } from '../services/api';

export const getWeather = createAsyncThunk(
  'weather/getWeather',
  async ({ latitude, longitude }, { rejectWithValue }) => {
    try {
      return await fetchWeather(latitude, longitude);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const searchLocations = createAsyncThunk(
  'weather/searchLocations',
  async (query, { rejectWithValue }) => {
    try {
      return await searchCities(query);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    currentWeather: null,
    hourlyForecast: [],
    dailyForecast: [],
    searchResults: [],
    loading: false,
    searchLoading: false,
    error: null,
    searchError: null,
  },
  reducers: {
    clearWeather: (state) => {
      state.currentWeather = null;
      state.hourlyForecast = [];
      state.dailyForecast = [];
      state.error = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // weather fetch
      .addCase(getWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWeather = action.payload.current;
        state.hourlyForecast = action.payload.hourly;
        state.dailyForecast = action.payload.daily;
      })
      .addCase(getWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch weather';
      })
      // city search
      .addCase(searchLocations.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchLocations.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchLocations.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload || 'Search failed';
      });
  },
});

export const { clearWeather, clearSearchResults } = weatherSlice.actions;
export default weatherSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    cities: [],
  },
  reducers: {
    addFavorite: (state, action) => {
      const city = action.payload;
      // don't add duplicates
      if (!state.cities.some(c => c.id === city.id)) {
        state.cities.push(city);
      }
    },
    removeFavorite: (state, action) => {
      state.cities = state.cities.filter(c => c.id !== action.payload);
    },
    updateFavoriteWeather: (state, action) => {
      const { cityId, weather } = action.payload;
      const city = state.cities.find(c => c.id === cityId);
      if (city) {
        city.currentWeather = weather;
      }
    },
  },
});

export const { addFavorite, removeFavorite, updateFavoriteWeather } = favoritesSlice.actions;
export default favoritesSlice.reducer;

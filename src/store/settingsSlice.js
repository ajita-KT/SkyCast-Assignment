import { createSlice } from '@reduxjs/toolkit';

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    temperatureUnit: 'celsius',
    windSpeedUnit: 'kmh',
    darkTheme: false,
  },
  reducers: {
    setTemperatureUnit: (state, action) => {
      state.temperatureUnit = action.payload;
    },
    setWindSpeedUnit: (state, action) => {
      state.windSpeedUnit = action.payload;
    },
    setDarkTheme: (state, action) => {
      state.darkTheme = action.payload;
    },
    toggleDarkTheme: (state) => {
      state.darkTheme = !state.darkTheme;
    },
  },
});

export const { setTemperatureUnit, setWindSpeedUnit, setDarkTheme, toggleDarkTheme } = settingsSlice.actions;
export default settingsSlice.reducer;

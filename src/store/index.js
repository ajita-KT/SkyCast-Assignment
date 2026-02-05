import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import settingsReducer from './settingsSlice';
import favoritesReducer from './favoritesSlice';
import weatherReducer from './weatherSlice';

// only persist settings and favorites, not weather data
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['settings', 'favorites'],
};

const rootReducer = combineReducers({
  settings: settingsReducer,
  favorites: favoritesReducer,
  weather: weatherReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // redux-persist actions aren't serializable, ignore them
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

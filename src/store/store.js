// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from './weatherSlice';
import settingReducer from "./settingSlice"

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    settings : settingReducer
  },
});
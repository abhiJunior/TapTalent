
// src/store/settingSlice.js
import { createSlice } from '@reduxjs/toolkit';

const settingSlice = createSlice({
  name: 'settings',
  initialState: {
    unit: localStorage.getItem('tempUnit') || 'metric', // 'metric' or 'imperial'
  },
  reducers: {
    toggleUnit: (state) => {
      state.unit = state.unit === 'metric' ? 'imperial' : 'metric';
      localStorage.setItem('tempUnit', state.unit);
    },
  },
});

export const { toggleUnit } = settingSlice.actions;
export default settingSlice.reducer;
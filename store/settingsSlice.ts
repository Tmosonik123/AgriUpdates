import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SettingsState, CountySettings } from '../types/settings';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState: SettingsState = {
  settings: {
    selectedCounty: '',
  },
  isLoading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSettings: (state, action: PayloadAction<CountySettings>) => {
      state.settings = action.payload;
      // Save to AsyncStorage
      AsyncStorage.setItem('settings', JSON.stringify(action.payload));
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setSettings, setLoading, setError } = settingsSlice.actions;
export default settingsSlice.reducer; 
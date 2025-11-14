import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeState } from '../types';

const THEME_KEY = '@theme';

export const loadTheme = createAsyncThunk<'light' | 'dark'>(
  'theme/load',
  async () => {
    const theme = await AsyncStorage.getItem(THEME_KEY);
    return (theme as 'light' | 'dark') || 'light';
  }
);

export const saveTheme = createAsyncThunk<'light' | 'dark', 'light' | 'dark'>(
  'theme/save',
  async (theme) => {
    await AsyncStorage.setItem(THEME_KEY, theme);
    return theme;
  }
);

const initialState: ThemeState = {
  mode: 'light',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTheme.fulfilled, (state, action: PayloadAction<'light' | 'dark'>) => {
        state.mode = action.payload;
      })
      .addCase(saveTheme.fulfilled, (state, action: PayloadAction<'light' | 'dark'>) => {
        state.mode = action.payload;
      });
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
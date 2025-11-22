import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import { ThemeState } from '../types';

const THEME_KEY = '@theme';

// Load theme: check AsyncStorage, then fallback to device Appearance, then 'light'
export const loadTheme = createAsyncThunk<'light' | 'dark'>('theme/load', async () => {
  try {
    const stored = await AsyncStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    const sys = Appearance.getColorScheme();
    return sys === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
});

// Save theme (explicit)
export const saveTheme = createAsyncThunk<'light' | 'dark', 'light' | 'dark'>(
  'theme/save',
  async (theme) => {
    await AsyncStorage.setItem(THEME_KEY, theme);
    return theme;
  }
);

// Toggle theme and persist it (use this thunk in UI instead of dispatching toggleTheme())
export const toggleAndSave = createAsyncThunk<'light' | 'dark'>(
  'theme/toggleAndSave',
  async (_arg, { getState, dispatch }) => {
    const state = getState() as any;
    const current: 'light' | 'dark' = state?.theme?.mode ?? 'light';
    const next: 'light' | 'dark' = current === 'light' ? 'dark' : 'light';
    // persist
    await AsyncStorage.setItem(THEME_KEY, next);
    // also resolve saveTheme for consistency (optional)
    dispatch(saveTheme(next));
    return next;
  }
);

const initialState: ThemeState = {
  mode: 'light',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    // keep a simple synchronous toggle action if you need it for tests or reducers,
    // but prefer toggleAndSave() in UI so the choice is persisted.
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.mode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTheme.fulfilled, (state, action: PayloadAction<'light' | 'dark'>) => {
        state.mode = action.payload;
      })
      .addCase(saveTheme.fulfilled, (state, action: PayloadAction<'light' | 'dark'>) => {
        state.mode = action.payload;
      })
      .addCase(toggleAndSave.fulfilled, (state, action: PayloadAction<'light' | 'dark'>) => {
        state.mode = action.payload;
      });
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
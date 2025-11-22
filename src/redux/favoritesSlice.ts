import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoritesState, Movie } from '../types';

const FAVORITES_KEY = '@favorites';

export const loadFavorites = createAsyncThunk<Movie[]>(
  'favorites/load',
  async () => {
    const favoritesJson = await AsyncStorage.getItem(FAVORITES_KEY);
    return favoritesJson ? JSON.parse(favoritesJson) : [];
  }
);

export const saveFavorites = createAsyncThunk<Movie[], Movie[]>(
  'favorites/save',
  async (favorites) => {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return favorites;
  }
);

const initialState: FavoritesState = {
  items: [],
  loading: false,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<Movie>) => {
      const movie = action.payload;
      const exists = state.items.find((item) => item.id === movie.id);

      if (exists) {
        state.items = state.items.filter((item) => item.id !== movie.id);
      } else {
        state.items.push(movie);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFavorites.fulfilled, (state, action: PayloadAction<Movie[]>) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(saveFavorites.fulfilled, (state, action: PayloadAction<Movie[]>) => {
        state.items = action.payload;
      });
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
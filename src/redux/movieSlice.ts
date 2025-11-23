import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { movieService } from '../services/api';
import { MoviesState, MoviesResponse, MovieDetails } from '../types';

export const fetchTrendingMovies = createAsyncThunk<MoviesResponse, number>(
  'movies/fetchTrending',
  async (page = 1) => {
    const response = await movieService.getTrendingMovies(page);
    return response;
  }
);

export const fetchPopularMovies = createAsyncThunk<MoviesResponse, number>(
  'movies/fetchPopular',
  async (page = 1) => {
    const response = await movieService.getPopularMovies(page);
    return response;
  }
);

export const fetchMovieDetails = createAsyncThunk<MovieDetails, number>(
  'movies/fetchDetails',
  async (movieId) => {
    const response = await movieService.getMovieDetails(movieId);
    return response;
  }
);

const initialState: MoviesState = {
  trending: [],
  popular: [],
  selectedMovie: null,
  loading: false,
  error: null,
};

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    clearSelectedMovie: (state) => {
      state.selectedMovie = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Trending movies
      .addCase(fetchTrendingMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTrendingMovies.fulfilled, (state, action: PayloadAction<MoviesResponse>) => {
        state.loading = false;
        state.trending = action.payload.results;
      })
      .addCase(fetchTrendingMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch trending movies';
      })
      // Popular movies
      .addCase(fetchPopularMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPopularMovies.fulfilled, (state, action: PayloadAction<MoviesResponse>) => {
        state.loading = false;
        state.popular = action.payload.results;
      })
      .addCase(fetchPopularMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch popular movies';
      })
      // Movie details
      .addCase(fetchMovieDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action: PayloadAction<MovieDetails>) => {
        state.loading = false;
        state.selectedMovie = action.payload;
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch movie details';
      });
  },
});

export const { clearSelectedMovie } = moviesSlice.actions;
export default moviesSlice.reducer;
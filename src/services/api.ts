import axios, { AxiosInstance } from 'axios';
import {
  TMDB_API_KEY,
  TMDB_BASE_URL,
  AUTH_BASE_URL,
  ENDPOINTS,
} from '../constants/api';
import {
  Movie,
  MovieDetails,
  MoviesResponse,
  User,
  LoginCredentials,
  RegisterCredentials,
} from '../types';

// TMDB API Instance
const tmdbApi: AxiosInstance = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

// Auth API Instance
const authApi: AxiosInstance = axios.create({
  baseURL: AUTH_BASE_URL,
});

// Movie Services
export const movieService = {
  getTrendingMovies: async (page: number = 1): Promise<MoviesResponse> => {
    const response = await tmdbApi.get<MoviesResponse>(ENDPOINTS.TRENDING_MOVIES, {
      params: { page },
    });
    return response.data;
  },

  getPopularMovies: async (page: number = 1): Promise<MoviesResponse> => {
    const response = await tmdbApi.get<MoviesResponse>(ENDPOINTS.POPULAR_MOVIES, {
      params: { page },
    });
    return response.data;
  },

  getMovieDetails: async (movieId: number): Promise<MovieDetails> => {
    const response = await tmdbApi.get<MovieDetails>(
      `${ENDPOINTS.MOVIE_DETAILS}/${movieId}`
    );
    return response.data;
  },

  searchMovies: async (query: string, page: number = 1): Promise<MoviesResponse> => {
    const response = await tmdbApi.get<MoviesResponse>(ENDPOINTS.SEARCH_MOVIES, {
      params: { query, page },
    });
    return response.data;
  },
};

// Authentication Services
export const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    const response = await authApi.post<User>(ENDPOINTS.LOGIN, {
      username: credentials.username,
      password: credentials.password,
      expiresInMins: 30,
    });
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<User> => {
    // Mock registration (DummyJSON doesn't have register endpoint)
    return {
      id: Date.now(),
      username: credentials.username,
      email: credentials.email,
      firstName: credentials.username,
      lastName: '',
      token: 'mock_token_' + Date.now(),
    };
  },
};
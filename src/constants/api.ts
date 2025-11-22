// TMDB API Configuration
export const TMDB_API_KEY = '4cbaa5451934c59f77a10909a64e7018'; // Replace with your API key
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// DummyJSON for Authentication
export const AUTH_BASE_URL = 'https://dummyjson.com';

// API Endpoints
export const ENDPOINTS = {
  // Movies
  TRENDING_MOVIES: '/trending/movie/week',
  POPULAR_MOVIES: '/movie/popular',
  TOP_RATED_MOVIES: '/movie/top_rated',
  MOVIE_DETAILS: '/movie',
  SEARCH_MOVIES: '/search/movie',
  
  // Auth (DummyJSON)
  LOGIN: '/auth/login',
  USER: '/auth/me',
} as const;
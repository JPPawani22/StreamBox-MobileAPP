import axios, { AxiosInstance } from 'axios';
import {
  TMDB_API_KEY,
  TMDB_BASE_URL,
  TMDB_IMAGE_BASE_URL,
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

// --- TMDB API Instance -----------------------------------------------------
if (!TMDB_API_KEY) {
  // helpful runtime warning in Metro/Expo logs if env isn't injected
  // eslint-disable-next-line no-console
  console.warn('[services/api] TMDB_API_KEY is empty. Set TMDB_API_KEY in .env or via app.config.');
}

const tmdbApi: AxiosInstance = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

// --- Auth API Instance -----------------------------------------------------
const authApi: AxiosInstance = axios.create({
  baseURL: AUTH_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Movie Services --------------------------------------------------------
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

// --- Authentication Services -----------------------------------------------
// where token is always present (mapped from accessToken when necessary).
export const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    // defensive trimming to avoid "Invalid credentials" because of trailing spaces
    const username = (credentials.username ?? '').trim();
    const password = (credentials.password ?? '').trim();

    try {
      // eslint-disable-next-line no-console
      console.log('[authService] login request to', `${AUTH_BASE_URL}${ENDPOINTS.LOGIN}`, {
        username,
      });

      const response = await authApi.post(ENDPOINTS.LOGIN, {
        username,
        password,
        expiresInMins: 30,
      });

      // DummyJSON returns an object containing accessToken (and user fields)
      const data: any = response.data;

      // Normalize into our User shape and map accessToken -> token
      const normalized: User = {
        id: data.id ?? data.user?.id ?? data?.id ?? 0,
        username: data.username ?? data.user?.username ?? username,
        email: data.email ?? data.user?.email ?? '',
        firstName: data.firstName ?? data.user?.firstName ?? '',
        lastName: data.lastName ?? data.user?.lastName ?? '',
        // Map accessToken to token so downstream code that expects "token" keeps working
        token: (data.accessToken as string) ?? (data.token as string) ?? '',
        // include other fields if available (cast to any to avoid TS error)
        ...(data as object),
      } as User;

      // eslint-disable-next-line no-console
      //console.log('[authService] login response (normalized):', normalized);
      return normalized;
    } catch (err: any) {
      // eslint-disable-next-line no-console
      //console.error('[authService] login error:', err?.response?.data ?? err.message ?? err);
      throw err;
    }
  },

  register: async (credentials: RegisterCredentials): Promise<User> => {
    try {
      // eslint-disable-next-line no-console
      console.log('[authService] register request to', `${AUTH_BASE_URL}/users/add`, {
        username: credentials.username,
        email: credentials.email,
      });

      const response = await authApi.post<any>('/users/add', {
        username: credentials.username,
        email: credentials.email,
        password: credentials.password,
      });

      const returned = response.data as Partial<User>;

      // DummyJSON /users/add does not return an auth token. Provide a mock token
      // so the registering client can be immediately considered authenticated.
      const userWithToken: User = {
        id: returned.id ?? Date.now(),
        username: returned.username ?? credentials.username,
        email: returned.email ?? credentials.email,
        firstName: returned.firstName ?? credentials.username,
        lastName: returned.lastName ?? '',
        token: (returned as any).token ?? 'mock_token_' + Date.now(),
        ...(returned as object),
      } as User;

      // eslint-disable-next-line no-console
      //console.log('[authService] register response (normalized):', userWithToken);
      return userWithToken;
    } catch (err: any) {
      // eslint-disable-next-line no-console
      //console.warn('[authService] register failed on remote, falling back to mock user:', err?.response?.data ?? err.message ?? err);
      const mockUser: User = {
        id: Date.now(),
        username: credentials.username,
        email: credentials.email,
        firstName: credentials.username,
        lastName: '',
        token: 'mock_token_' + Date.now(),
      };
      return mockUser;
    }
  },
};

// Export instances in case other modules need them
export { tmdbApi, authApi, TMDB_IMAGE_BASE_URL };
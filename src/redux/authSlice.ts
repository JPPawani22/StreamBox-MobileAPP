import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/api';
import { AuthState, User, LoginCredentials, RegisterCredentials } from '../types';

// Async thunks
export const loginUser = createAsyncThunk<
  User,
  LoginCredentials,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await authService.login(credentials);
    await AsyncStorage.setItem('userToken', response.token);
    await AsyncStorage.setItem('userData', JSON.stringify(response));
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const registerUser = createAsyncThunk<
  User,
  RegisterCredentials,
  { rejectValue: string }
>('auth/register', async (credentials, { rejectWithValue }) => {
  try {
    const response = await authService.register(credentials);
    await AsyncStorage.setItem('userToken', response.token);
    await AsyncStorage.setItem('userData', JSON.stringify(response));
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Registration failed');
  }
});

export const loadUserFromStorage = createAsyncThunk<
  { token: string; user: User },
  void,
  { rejectValue: string }
>('auth/loadUser', async (_, { rejectWithValue }) => {
  try {
    const userToken = await AsyncStorage.getItem('userToken');
    const userData = await AsyncStorage.getItem('userData');

    if (userToken && userData) {
      return {
        token: userToken,
        user: JSON.parse(userData),
      };
    }
    return rejectWithValue('No user data found');
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await AsyncStorage.removeItem('userToken');
  await AsyncStorage.removeItem('userData');
});

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      })
      // Load user
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
export interface ColorScheme {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  error: string;
}

export interface Colors {
  light: ColorScheme;
  dark: ColorScheme;
}

export const COLORS: Colors = {
  light: {
    primary: '#E50914',
    secondary: '#831010',
    background: '#F2F4F8',
    card: '#FFFFFF',
    text: '#0B0B0B',
    textSecondary: '#6B7280',
    border: '#D1D5DB',
    success: '#4CAF50',
    error: '#F44336',
  },
  dark: {
    primary: '#E50914',
    secondary: '#831010',
    background: '#0B0B0B',
    card: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B3B3B3',
    border: '#2C2C2C',
    success: '#4CAF50',
    error: '#F44336',
  },
};
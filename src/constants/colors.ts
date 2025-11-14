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
    secondary: '#221F1F',
    background: '#FFFFFF',
    card: '#F5F5F5',
    text: '#000000',
    textSecondary: '#757575',
    border: '#E0E0E0',
    success: '#4CAF50',
    error: '#F44336',
  },
  dark: {
    primary: '#E50914',
    secondary: '#831010',
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B3B3B3',
    border: '#2C2C2C',
    success: '#4CAF50',
    error: '#F44336',
  },
};
// Minimal type declarations for react-native-dotenv (@env).
// Add every env var name you use as an exported const below.

declare module '@env' {
  // list your environment variables here
  export const EXPO_TMDB_API_KEY: string;
  export const API_BASE_URL: string;

  // If you prefer a fallback for unknown names, you can also export a generic default:
  // export default {
  //   TMDB_API_KEY: string,
  //   API_BASE_URL: string,
  //   [key: string]: string,
  // };
}
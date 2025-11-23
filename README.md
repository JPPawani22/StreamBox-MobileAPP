# StreamBox (StreamBox-MobileAPP)

StreamBox is a cross-platform React Native app (TypeScript) built for the Mobile Applications Development. The app demonstrates a movie/media browsing experience (entertainment domain), implementing authentication, navigation, API integration, state management with Redux Toolkit, favourites persistence, responsive UI with Feather Icons, and optional dark mode.

- Project overview and features mapped to the assignment
- Installation & setup steps
- How authentication works
- State management & persistence
- How to add environment variables (multiple approaches)
- Run/build scripts, testing and deliverables

---

Table of contents
- Project overview
- Features
- Install & run (development)
- Environment variables (.env)
  -react-native-dotenv / @env
  - Example .env
- Authentication flow
- State management & persistence
- API integration & axios setup
- Styling, icons, and responsiveness
- Dark mode

---

Project overview
StreamBox fetches media items from a public API, displays them in a card list on the Home screen, supports viewing details, marking favourites (persisted locally), and basic user authentication. The project uses TypeScript, React Navigation, Redux Toolkit, AsyncStorage (redux-persist) and Feather Icons.

Features
- User registration and login (dummy API)
- Login persists authentication state and shows username in header/profile
- Navigation: Auth flow + App flow with Bottom Tabs and Stack navigation
- Home: dynamic item list fetched from API (image, title, short description/status)
- Details screen: view details & add/remove favourites
- Favourites screen: view persisted favourites
- State management: Redux Toolkit + redux-persist (AsyncStorage)
- API integration via axios with a central instance (baseURL from env)
- Styling: consistent UI, Feather Icons, responsive layout
- Dark mode toggle


Prerequisites
- Node.js (>= 16 LTS recommended)
- npm or yarn
- Expo CLI (if using Expo) or React Native CLI if using bare workflow
- (Optional) Android Studio / Xcode for devices/emulators

Install & run (development)
1. Clone repository
   git clone https://github.com/JPPawani22/StreamBox-MobileAPP.git
   cd StreamBox-MobileAPP

2. Install dependencies
   npm install
   or
   yarn

3. Create environment variables (see the Environment variables section below).
   - Add .env file to project root (do NOT commit secrets).

4. Start the app
   - For Expo:
     npx expo start
     - Open on device with Expo Go, or run on Android/iOS simulator
   - For bare React Native:
     npx react-native run-android
     npx react-native run-ios

Useful npm scripts
- npm run start
- npm run ios
- npm run android
- npm run lint
- npm run test

Environment variables (.env)
The app uses environment variables for API base URLs, API keys, and feature toggles.

Common vars used in the app:
- API_URL or TMDB_API_URL — base URL for item API
- TMDB_API_KEY — optional API key for TMDB
- AUTH_API_URL — authentication API endpoint (dummy)


Example .env ( .env.example)

React-native-dotenv / @env (works for bare and many setups)
1. Install
   npm install react-native-dotenv --save-dev
   or
   yarn add -D react-native-dotenv

2. Add plugin to babel.config.js:
   module.exports = function(api) {
     api.cache(true);
     return {
       presets: ['babel-preset-expo'],
       plugins: [
         ['module:react-native-dotenv', {
           moduleName: '@env',
           path: '.env',
           safe: false,
           allowUndefined: true
         }]
       ]
     };
   };

3. Usage in code (TypeScript):
   // src/config/env.ts
   import { API_URL, TMDB_API_KEY } from '@env';

   export default {
     apiUrl: API_URL,
     tmdbKey: TMDB_API_KEY
   };

   Then import env values where needed:
   import env from '../config/env';
   axios.create({ baseURL: env.apiUrl })

- For TypeScript, create a declaration to avoid type errors (src/@types/env.d.ts):
  declare module '@env' {
    export const API_URL: string;
    export const TMDB_API_KEY: string;
    export const AUTH_API_URL: string;
  }


Example .env (.env.example)
- Add this to root as .env
- API_URL=https://api.example.com
- TMDB_API_KEY=your_tmdb_key_here
- AUTH_API_URL=https://auth.example.com
- APP_ENV=development

Authentication flow
- Registration/Login screens use react-hook-form + Yup for validation.
- On successful login:
  - Save token (or mock token) to secure storage:
    - Expo: expo-secure-store (recommended) or AsyncStorage for simpler implementation
  - Set Redux auth slice with user info and token
  - Navigate to AppStack
- Display username in the header/profile area using auth state from Redux store.
- Logout clears token from storage and resets auth slice.

State management & persistence
- Redux Toolkit is used (store configured with slices):
  - authSlice: user, token, isAuthenticated
  - movieSlice: list of fetched items, loading, error
  - favouritesSlice: Map/array of favourite item ids + meta
- redux-persist + AsyncStorage to persist favourites and optionally auth state.

API integration & axios setup
- Central axios instance
- BaseURL configured from env
- Request interceptor attaches token if available
- Response interceptor handles errors and token expiry hooks
- Example:
  axiosInstance.get('/movies/popular')

Favourites persistence
- Users can toggle favourite on Details screen
- Favourites are stored in redux favouritesSlice and persisted with redux-persist (AsyncStorage)
- Favourites screen reads persisted favourites and displays items

Styling & icons
- Styling uses StyleSheet with responsive units and percentages where appropriate
- Feather Icons used via react-native-vector-icons/Feather (or @expo/vector-icons)
- Ensure icon sizes scale for different devices

Dark mode
- Implemented via a ThemeContext or by using React Native Appearance and toggling theme values in a Theme slice


import { Platform } from 'react-native';

// Production backend on Render
const RENDER_URL = 'https://mulango-hospital-lost-and-found-d9sa.onrender.com';

// Use Render in production, fallback to local dev server
const API_BASE = __DEV__
  ? (Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000')
  : RENDER_URL;

export default {
  API_BASE,
  APP_VERSION: 'v2.0.0',
  GITHUB_REPO: 'NiklausJoelBJunior/Mulango_hospital_lost_and_found'
};

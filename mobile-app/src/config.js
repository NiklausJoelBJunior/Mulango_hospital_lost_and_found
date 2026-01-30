import { Platform } from 'react-native';

// When deploying to Render, replace the 'YOUR_RENDER_URL' with your actual backend URL
// Example: https://mlaf-backend.onrender.com
const RENDER_URL = 'YOUR_RENDER_URL'; 

const API_BASE = RENDER_URL !== 'YOUR_RENDER_URL' 
  ? RENDER_URL 
  : (Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000');

export default {
  API_BASE,
  APP_VERSION: 'v1', // Update this when building new major versions
  GITHUB_REPO: 'NiklausJoelBJunior/Mulango_hospital_lost_and_found'
};

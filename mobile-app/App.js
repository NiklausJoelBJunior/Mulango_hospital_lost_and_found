import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import UpdateHandler from './src/components/UpdateHandler';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <UpdateHandler />
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

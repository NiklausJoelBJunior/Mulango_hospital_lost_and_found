import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

export const AuthContext = createContext({
  token: null,
  admin: null,
  loading: false,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const t = await SecureStore.getItemAsync('adminToken');
        const u = await SecureStore.getItemAsync('adminUser');
        if (t) setToken(t);
        if (u) setAdmin({ username: u });
      } catch (e) {
        console.warn('AuthProvider failed to read secure store', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signIn = async ({ token: newToken, admin: adminObj }) => {
    setLoading(true);
    try {
      await SecureStore.setItemAsync('adminToken', newToken);
      if (adminObj && adminObj.username) await SecureStore.setItemAsync('adminUser', adminObj.username);
      setToken(newToken);
      setAdmin(adminObj);
    } catch (e) {
      console.warn('signIn failed', e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await SecureStore.deleteItemAsync('adminToken');
      await SecureStore.deleteItemAsync('adminUser');
      setToken(null);
      setAdmin(null);
    } catch (e) {
      console.warn('signOut failed', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ token, admin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

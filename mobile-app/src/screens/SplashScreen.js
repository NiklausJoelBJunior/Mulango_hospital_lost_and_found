import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    // Keep splash visible for 5 seconds, then go to the main app
    const timer = setTimeout(() => {
      navigation.replace('Main');
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>MLAF</Text>
      <Text style={styles.subtitle}>Mulago Lost and Found</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e7490',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
  },
});

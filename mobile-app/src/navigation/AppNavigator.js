import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import PostItemScreen from '../screens/PostItemScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AdminLoginScreen from '../screens/AdminLoginScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#0e7490',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen 
          name="PostItem" 
          component={PostItemScreen}
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen 
          name="AdminLogin" 
          component={AdminLoginScreen}
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen 
          name="AdminDashboard" 
          component={AdminDashboardScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

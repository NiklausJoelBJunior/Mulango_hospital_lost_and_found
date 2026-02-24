import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';

// Screens
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import PostItemScreen from '../screens/PostItemScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AdminLoginScreen from '../screens/AdminLoginScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import SplashScreen from '../screens/SplashScreen';
import ItemDetailScreen from '../screens/ItemDetailScreen';
import AdminItemDetailScreen from '../screens/AdminItemDetailScreen';
import ContactScreen from '../screens/ContactScreen';
import FAQScreen from '../screens/FAQScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const { width } = Dimensions.get('window');

function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBarInner}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const label = descriptors[route.key].options.tabBarLabel
            || descriptors[route.key].options.title
            || route.name;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              onPress={onPress}
              style={styles.tabButton}
              activeOpacity={0.8}
            >
              <Ionicons
                name={route.name === 'Home' ? (focused ? 'home' : 'home-outline') :
                      route.name === 'Search' ? (focused ? 'search' : 'search-outline') :
                      (focused ? 'person' : 'person-outline')}
                size={22}
                color={focused ? '#0EA5E9' : '#64748B'}
              />
              <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Floating center FAB to post an item */}
      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => navigation.navigate('PostItem')}
        activeOpacity={0.9}
      >
        <View style={styles.fabInner}>
          <Ionicons name="add" size={28} color="#fff" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Search" component={SearchScreen} options={{ tabBarLabel: 'Search' }} />
      {/* <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} /> */}
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Main" component={MainTabNavigator} />

        {/* Modals / secondary screens */}
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen name="PostItem" component={PostItemScreen} />
          <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
        </Stack.Group>

        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
        <Stack.Screen name="ItemDetail" component={ItemDetailScreen} />
        <Stack.Screen name="AdminItemDetail" component={AdminItemDetailScreen} />
        <Stack.Screen name="Contact" component={ContactScreen} />
        <Stack.Screen name="FAQ" component={FAQScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 12,
    left: 35,
    right: 35,
    height: 70,
    width: 330,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width - 120,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
  },
  tabLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: '#0EA5E9',
  },
  fabButton: {
    position: 'absolute',
    top: -28,
    alignSelf: 'center',
  },
  fabInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0EA5E9',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 10,
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');

  const recentItems = [
    { id: 1, name: 'Black Wallet', location: 'ER - Room 203', date: '2 hours ago', status: 'Verified' },
    { id: 2, name: 'iPhone 13', location: 'Waiting Area', date: '5 hours ago', status: 'Verified' },
    { id: 3, name: 'Reading Glasses', location: 'Pharmacy', date: '1 day ago', status: 'Verified' },
    { id: 4, name: 'Keys with Blue Keychain', location: 'Parking Lot B', date: '1 day ago', status: 'Verified' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.appTitle}>MLAF</Text>
          <Text style={styles.subtitle}>Medical Lost and Found</Text>
        </View>
        <View style={styles.iconCircle}>
          <FontAwesome5 name="hospital-alt" size={28} color="#fff" />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for your lost item..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('PostItem')}
          >
            <Text style={styles.actionIcon}>�</Text>
            <Text style={styles.actionText}>Post Item</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Search')}
          >
            <Text style={styles.actionIcon}>🔎</Text>
            <Text style={styles.actionText}>Search Items</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('AdminLogin')}
          >
            <Text style={styles.actionIcon}>�</Text>
            <Text style={styles.actionText}>Admin</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>247</Text>
            <Text style={styles.statLabel}>Lost Items Posted</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>198</Text>
            <Text style={styles.statLabel}>Items Reunited</Text>
          </View>
        </View>

        {/* Recent Items */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recently Posted Items</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {recentItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.itemCard}>
            <View style={styles.itemIconContainer}>
              <MaterialIcons name="inventory-2" size={24} color="#0e7490" />
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <View style={styles.itemLocationRow}>
                <Ionicons name="location" size={14} color="#666" />
                <Text style={styles.itemLocation}> {item.location}</Text>
              </View>
              <View style={styles.itemLocationRow}>
                <Ionicons name="time" size={14} color="#999" />
                <Text style={styles.itemDate}> {item.date}</Text>
              </View>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Help Section */}
        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>Need Help?</Text>
          <Text style={styles.helpText}>
            Contact our lost and found department at the main reception desk
          </Text>
          <TouchableOpacity style={styles.helpButton}>
            <Text style={styles.helpButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#0e7490',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.9,
  },
  appTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
    marginTop: 4,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },
  actionButton: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 25,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#0e7490',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
    opacity: 0.9,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAll: {
    fontSize: 14,
    color: '#0e7490',
    fontWeight: '600',
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0f2f7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  itemLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  itemLocation: {
    fontSize: 13,
    color: '#666',
  },
  itemDate: {
    fontSize: 12,
    color: '#999',
  },
  statusBadge: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#065f46',
    fontSize: 12,
    fontWeight: '600',
  },
  helpSection: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  helpButton: {
    backgroundColor: '#0e7490',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  helpButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

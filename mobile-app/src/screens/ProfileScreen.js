import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
      const menuItems = [
    { id: 1, title: 'Personal Information', icon: 'person', color: '#0e7490' },
    { id: 2, title: 'Notifications', icon: 'notifications', color: '#ef4444' },
    { id: 3, title: 'Privacy & Security', icon: 'lock-closed', color: '#8b5cf6' },
    { id: 4, title: 'Help & Support', icon: 'help-circle', color: '#10b981' },
    { id: 5, title: 'Terms & Conditions', icon: 'document-text', color: '#f59e0b' },
    { id: 6, title: 'About', icon: 'information-circle', color: '#6366f1' },
  ];

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>JD</Text>
        </View>
        <Text style={styles.userName}>John Doe</Text>
        <Text style={styles.userEmail}>john.doe@email.com</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Reports</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>2</Text>
          <Text style={styles.statLabel}>Found</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>1</Text>
          <Text style={styles.statLabel}>Claimed</Text>
        </View>
      </View>

      {/* Menu Items */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                  {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem}>
              <View style={[styles.menuIconContainer, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon} size={22} color={item.color} />
              </View>
              <Text style={styles.menuText}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 1.0.0</Text>
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
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0e7490',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0e7490',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  menuItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  menuIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#e0f2f7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuInfo: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  menuSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ff6b6b',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff6b6b',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    marginVertical: 20,
  },
});

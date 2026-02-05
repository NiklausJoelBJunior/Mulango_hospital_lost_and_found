import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Platform, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import ItemCard from '../components/ItemCard';

const { width } = Dimensions.get('window');

import Config from '../config';

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');

  const [recentItems, setRecentItems] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(false);

  const API_BASE = Config.API_BASE;

  useEffect(() => {
    let mounted = true;
    const fetchRecent = async () => {
      setLoadingRecent(true);
      try {
        const res = await fetch(`${API_BASE}/items`);
        if (!res.ok) throw new Error('Failed to load items');
        const items = await res.json();
        // pick recent approved items
        const approved = Array.isArray(items) ? items.filter(i => i.status === 'approved') : [];
        const sorted = approved.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
        if (mounted) setRecentItems(sorted.slice(0,6));
      } catch (err) {
        console.warn('Could not load recent items', err);
      } finally {
        if (mounted) setLoadingRecent(false);
      }
    };
    fetchRecent();
    return () => { mounted = false; };
  }, []);

  const getCategoryIcon = (category) => {
    const icons = {
      wallet: 'wallet',
      electronics: 'smartphone',
      accessories: 'glasses',
      keys: 'key',
      default: 'inventory-2'
    };
    return icons[category] || icons.default;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Enhanced Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>Welcome to</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AdminLogin')} activeOpacity={0.7}>
              <Text style={styles.appTitle}>MLAF</Text>
            </TouchableOpacity>
            <Text style={styles.subtitle}>Medical Lost & Found</Text>
          </View>
          <View style={styles.headerIcons}>
            <View style={styles.iconCircle}>
              <FontAwesome5 name="hospital-alt" size={24} color="#fff" />
            </View>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Enhanced Search Bar
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search lost items, locations..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity style={styles.filterButton}>
            <Feather name="sliders" size={18} color="#0EA5E9" />
          </TouchableOpacity>
        </View> */}

        {/* Quick Actions Grid */}
        <View style={styles.section}>
          {/* <Text style={styles.sectionTitle}>Quick Actions</Text> */}
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('PostItem')}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: '#E0F2FE' }]}>
                <MaterialIcons name="post-add" size={24} color="#0EA5E9" />
              </View>
              <Text style={styles.actionText}>Post Item</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Search')}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: '#F0FDF4' }]}>
                <Ionicons name="search" size={24} color="#22C55E" />
              </View>
              <Text style={styles.actionText}>Search Items</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Items */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recently Posted Items</Text>
            <TouchableOpacity 
              style={styles.seeAllButton}
              onPress={() => navigation.navigate('Search')}
            >
              <Text style={styles.seeAllText}>View All</Text>
              <Feather name="chevron-right" size={16} color="#0EA5E9" />
            </TouchableOpacity>
          </View>

          {loadingRecent ? (
            <ActivityIndicator size="small" color="#0EA5E9" style={{ paddingVertical: 12 }} />
          ) : (
            <View style={styles.gridContainer}>
              {recentItems.map((item) => (
                <View key={item._id || item.id} style={styles.gridItem}>
                  <ItemCard 
                    item={item} 
                    navigation={navigation} 
                    isGrid={true}
                    showStatus={false}
                  />
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Help Section */}
        <View style={styles.helpSection}>
          <View style={styles.helpIcon}>
            <Feather name="help-circle" size={32} color="#0EA5E9" />
          </View>
          <Text style={styles.helpTitle}>Need Assistance?</Text>
          <Text style={styles.helpText}>
            Our lost and found team is available at the main reception desk or through our support line
          </Text>
          <View style={styles.helpButtons}>
            <TouchableOpacity 
              style={[styles.helpButton, styles.primaryButton]}
              onPress={() => navigation.navigate('Contact')}
            >
              <Text style={styles.primaryButtonText}>Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.helpButton, styles.secondaryButton]}
              onPress={() => navigation.navigate('FAQ')}
            >
              <Text style={styles.secondaryButtonText}>View FAQ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#0EA5E9',
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  welcomeText: {
    color: '#E0F2FE',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  appTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: '#E0F2FE',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 24,
    marginTop: -20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  filterButton: {
    padding: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    width: (width - 72) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  seeAllText: {
    fontSize: 14,
    color: '#0EA5E9',
    fontWeight: '600',
    marginRight: 4,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48.5%',
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  itemIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  itemMeta: {
    gap: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 6,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  verifiedBadge: {
    backgroundColor: '#DCFCE7',
  },
  claimBadge: {
    backgroundColor: '#0EA5E9',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  claimText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '700',
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  helpSection: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    margin: 24,
    marginTop: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  helpIcon: {
    marginBottom: 16,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  helpText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  helpButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  helpButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#0EA5E9',
  },
  secondaryButton: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '600',
  },
});
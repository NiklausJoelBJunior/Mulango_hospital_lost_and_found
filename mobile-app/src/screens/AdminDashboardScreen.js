import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  ActivityIndicator,
  TextInput,
  StatusBar,
  Dimensions,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Config from '../config';

const { width } = Dimensions.get('window');

export default function AdminDashboardScreen({ navigation, route }) {
  const { token: ctxToken, signOut } = useContext(AuthContext);
  const initialToken = route?.params?.token || ctxToken || null;
  const [token] = useState(initialToken);
  const [pendingItems, setPendingItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [viewMode, setViewMode] = useState('pending');
  const [claimsCount, setClaimsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const API_BASE = Config.API_BASE;

  useFocusEffect(
    useCallback(() => {
      fetchItems();
    }, [token])
  );

  const fetchItems = async () => {
    setLoading(true);
    try {
      if (!token) {
        navigation.replace('AdminLogin');
        return;
      }
      const headers = { Authorization: 'Bearer ' + token };
      const res = await fetch(API_BASE + '/admin/items', { headers });
      if (!res.ok) throw new Error('Failed to load items');
      const items = await res.json();
      setPendingItems(Array.isArray(items) ? items : []);

      const allRes = await fetch(API_BASE + '/items');
      if (allRes.ok) {
        const fetchedAll = await allRes.json();
        const norm = Array.isArray(fetchedAll) ? fetchedAll : [];
        setAllItems(norm);
        setClaimsCount(norm.filter(it => it.status === 'approved' && it.claims?.length > 0).length);
      }
    } catch (err) {
      Alert.alert('Error', "Couldn't load items.");
    } finally {
      setLoading(false);
    }
  };

  const updateItemStatus = async (itemId, status) => {
    try {
      const res = await fetch(API_BASE + '/items/' + itemId, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Update failed');
      const updated = await res.json();
      setPendingItems(items => items.filter(i => i._id !== (updated._id || updated.id)));
      Alert.alert('Success', 'Item ' + status);
      fetchItems();
    } catch (err) {
      Alert.alert('Error', 'Could not update item.');
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Exit admin area?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: async () => {
        try { await signOut(); } catch (e) {}
        navigation.replace('Main');
      } },
    ]);
  };

  const getFilteredList = () => {
    let list = [];
    if (viewMode === 'pending') list = pendingItems;
    else if (viewMode === 'claims') list = allItems.filter(it => it.status === 'approved' && it.claims?.length > 0);
    else list = allItems; // Archive shows everything including pending

    return list.filter(it => {
      const query = searchQuery.toLowerCase();
      return (it.name || '').toLowerCase().includes(query) || (it.description || '').toLowerCase().includes(query);
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#10B981';
      case 'claimed': return '#0EA5E9';
      case 'rejected': return '#EF4444';
      default: return '#F59E0B';
    }
  };

  const renderItemCard = (item) => {
    const isPending = viewMode === 'pending';
    const isClaims = viewMode === 'claims';
    
    return (
      <TouchableOpacity 
        style={styles.itemCard} 
        key={item._id || item.id}
        onPress={() => navigation.navigate('AdminItemDetail', { item })}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.thumbnail} />
          ) : (
            <View style={styles.thumbnailPlaceholder}>
              <Image 
                source={require('../../assets/logo.png')} 
                style={[styles.placeholderLogo, { tintColor: '#CBD5E1' }]} 
                resizeMode="contain"
              />
            </View>
          )}
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusBadgeText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.mainInfo}>
          <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
          
          <View style={styles.locationContainer}>
            <MaterialCommunityIcons name="hospital-marker" size={14} color="#64748B" />
            <Text style={styles.locationText} numberOfLines={1}>{item.location}</Text>
          </View>

          {isClaims && (
            <View style={styles.claimsBadge}>
              <Feather name="users" size={12} color="#0EA5E9" />
              <Text style={styles.claimsCountText}>{item.claims?.length || 0} claims</Text>
            </View>
          )}
        </View>

        {isPending && (
          <View style={styles.cardActions}>
            <TouchableOpacity 
              style={[styles.actionBtn, styles.rejectBtn]} 
              onPress={() => updateItemStatus(item._id || item.id, 'rejected')}
            >
              <Feather name="x" size={14} color="#EF4444" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionBtn, styles.approveBtn]} 
              onPress={() => updateItemStatus(item._id || item.id, 'approved')}
            >
              <Feather name="check" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerWelcome}>Admin Management</Text>
            <Text style={styles.headerTitle}>Dashboard</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Feather name="log-out" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          {[
            { label: 'Pending', count: pendingItems.length, mode: 'pending', icon: 'clock' },
            { label: 'Claims', count: claimsCount, mode: 'claims', icon: 'users' },
            { label: 'Archive', count: allItems.length, mode: 'archive', icon: 'archive' }
          ].map((stat) => (
            <TouchableOpacity 
              key={stat.mode}
              style={[styles.statCard, viewMode === stat.mode && styles.statCardActive]}
              onPress={() => setViewMode(stat.mode)}
            >
              <Feather name={stat.icon} size={16} color={viewMode === stat.mode ? '#fff' : '#94A3B8'} />
              <Text style={[styles.statNumber, viewMode === stat.mode && styles.textWhite]}>{stat.count}</Text>
              <Text style={[styles.statLabel, viewMode === stat.mode && styles.textWhiteOp]}>{stat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.searchBar}>
          <Feather name="search" size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Filter by name or description..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollPadding}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{viewMode.toUpperCase()} ITEMS</Text>
          <View style={styles.badge}><Text style={styles.badgeText}>{getFilteredList().length}</Text></View>
        </View>

        {loading ? <ActivityIndicator size="large" color="#0EA5E9" style={{marginTop: 40}} /> : (
          <View style={styles.gridContainer}>
            {getFilteredList().map(item => renderItemCard(item))}
            {getFilteredList().length === 0 && (
               <View style={styles.emptyState}>
                 <Feather name="inbox" size={40} color="#CBD5E1" />
                 <Text style={styles.emptyStateText}>No items found in {viewMode}</Text>
               </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { paddingTop: 60, paddingBottom: 25, paddingHorizontal: 20, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  headerWelcome: { color: '#94A3B8', fontSize: 13, fontWeight: '500' },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  logoutButton: { padding: 12, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 14 },
  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 25 },
  statCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  statCardActive: { backgroundColor: '#0EA5E9', borderColor: '#38BDF8' },
  statNumber: { fontSize: 22, fontWeight: '800', color: '#fff', marginTop: 8 },
  statLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  textWhite: { color: '#fff' },
  textWhiteOp: { color: 'rgba(255,255,255,0.8)' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 14, paddingHorizontal: 16, height: 50 },
  searchInput: { flex: 1, color: '#fff', marginLeft: 12, fontSize: 15 },
  content: { flex: 1 },
  scrollPadding: { padding: 16, paddingBottom: 100 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15, paddingHorizontal: 4 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#64748B', letterSpacing: 1 },
  badge: { backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 12, fontWeight: '700', color: '#475569' },
  
  // Grid Inventory Card Styles
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  itemCard: { width: (width - 44) / 2, backgroundColor: '#fff', borderRadius: 24, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#F1F5F9', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 }, android: { elevation: 3 } }) },
  cardHeader: { height: 140, position: 'relative' },
  thumbnail: { width: '100%', height: '100%' },
  thumbnailPlaceholder: { width: '100%', height: '100%', backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  statusBadge: { position: 'absolute', top: 8, right: 8, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusBadgeText: { color: '#fff', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  mainInfo: { padding: 12 },
  itemName: { fontSize: 15, fontWeight: '700', color: '#1E293B', marginBottom: 4 },
  locationContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  locationText: { fontSize: 12, color: '#64748B', marginLeft: 4, flex: 1 },
  claimsBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F9FF', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  claimsCountText: { fontSize: 11, fontWeight: '600', color: '#0EA5E9', marginLeft: 4 },
  
  cardActions: { flexDirection: 'row', gap: 8, paddingHorizontal: 12, paddingBottom: 12 },
  actionBtn: { flex: 1, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  rejectBtn: { backgroundColor: '#FEF2F2' },
  approveBtn: { backgroundColor: '#10B981' },
  placeholderLogo: { width: 40, height: 40 },
  
  emptyState: { width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  emptyStateText: { marginTop: 12, color: '#94A3B8', fontSize: 15, fontWeight: '500' }
});
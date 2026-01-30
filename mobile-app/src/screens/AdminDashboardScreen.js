import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Platform, ActivityIndicator, TextInput } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import Config from '../config';

export default function AdminDashboardScreen({ navigation, route }) {
  const { token: ctxToken, admin: ctxAdmin, signOut } = useContext(AuthContext);
  const initialToken = route?.params?.token || ctxToken || null;
  const [token, setToken] = useState(initialToken);
  const [pendingItems, setPendingItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [viewMode, setViewMode] = useState('pending'); // 'pending' | 'claims'
  const [claimsCount, setClaimsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Electronics', 'Personal', 'Accessories', 'Documents', 'Clothing', 'Medical'];
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
        // not authenticated - redirect to login
        navigation.replace('AdminLogin');
        return;
      }
      const headers = { Authorization: `Bearer ${token}` };
      const res = await fetch(`${API_BASE}/admin/items`, { headers });
      if (!res.ok) throw new Error('Failed to load items');
      const items = await res.json();
      const pending = Array.isArray(items) ? items : [];
      setPendingItems(pending);

      // also fetch items to compute total claims
      try {
        const allRes = await fetch(`${API_BASE}/items`);
        if (allRes && allRes.ok) {
          const fetchedAll = await allRes.json();
          const normalized = Array.isArray(fetchedAll) ? fetchedAll : [];
          setAllItems(normalized);
          const activeItemsWithClaims = normalized.filter(it => it.status === 'approved' && Array.isArray(it.claims) && it.claims.length > 0);
          setClaimsCount(activeItemsWithClaims.length);
        }
      } catch (e) {
        console.warn('Could not fetch all items for claims count', e);
      }
    } catch (err) {
      console.error('Failed to fetch items', err);
      Alert.alert('Error', "Couldn't load items. Check backend is running and you are logged in.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (itemId) => {
    Alert.alert('Approve Item', 'Are you sure you want to approve this item?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Approve', onPress: () => updateItemStatus(itemId, 'approved') },
    ]);
  };

  const handleReject = (itemId) => {
    Alert.alert('Reject Item', 'Are you sure you want to reject this item?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reject', style: 'destructive', onPress: () => updateItemStatus(itemId, 'rejected') },
    ]);
  };

  const updateItemStatus = async (itemId, status) => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch(`${API_BASE}/items/${itemId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Update failed');
      const updated = await res.json();
      setPendingItems(items => items.filter(i => i._id !== updated._id));
      Alert.alert('Success', `Item ${status}`);
    } catch (err) {
      console.error('Update error', err);
      Alert.alert('Error', 'Could not update item.');
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: async () => {
        try {
          await signOut();
        } catch (e) {
          console.warn('signOut failed', e);
        }
        navigation.replace('Main');
      } },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>Admin Dashboard</Text>
            <Text style={styles.subtitle}>Review and verify posted items</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#dc2626" />
          </TouchableOpacity>
        </View>
        <View style={styles.statsContainer}>
          <TouchableOpacity style={[styles.statCard, viewMode === 'pending' && styles.statCardActive]} onPress={() => setViewMode('pending')}>
            <Text style={styles.statNumber}>{pendingItems.length}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.statCard, viewMode === 'claims' && styles.statCardActive]} onPress={() => setViewMode('claims')}>
            <Text style={styles.statNumber}>{claimsCount}</Text>
            <Text style={styles.statLabel}>Claims</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.statCard, viewMode === 'archive' && styles.statCardActive]} onPress={() => setViewMode('archive')}>
            <Text style={styles.statNumber}>{allItems.filter(it => it.status === 'approved' || it.status === 'claimed').length}</Text>
            <Text style={styles.statLabel}>Archive</Text>
          </TouchableOpacity>
        </View>

        {/* Search and Category Filter */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="rgba(255,255,255,0.6)" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search items..."
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color="rgba(255,255,255,0.6)" />
              </TouchableOpacity>
            )}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryBtn, selectedCategory === cat && styles.categoryBtnActive]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[styles.categoryBtnText, selectedCategory === cat && styles.categoryBtnTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>
          {viewMode === 'pending' ? 'Pending Items' : viewMode === 'claims' ? 'Claims' : 'All Items Archive'}
        </Text>
        {loading ? (
          <View style={{ paddingVertical: 40 }}>
            <ActivityIndicator size="large" color="#0e7490" />
          </View>
        ) : viewMode === 'pending' ? (
          (() => {
            const filtered = pendingItems.filter(it => {
              const query = searchQuery.toLowerCase();
              const matchesSearch = (it.name || '').toLowerCase().includes(query) || (it.description || '').toLowerCase().includes(query);
              const matchesCat = selectedCategory === 'All' || (it.category || '').toLowerCase().includes(selectedCategory.toLowerCase());
              return matchesSearch && matchesCat;
            });

            return filtered.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="checkmark-done" size={64} color="#0e7490" style={styles.emptyIcon} />
              <Text style={styles.emptyText}>All caught up!</Text>
              <Text style={styles.emptySubtext}>No pending items to review</Text>
            </View>
          ) : (
            filtered.map((item) => (
              <View style={styles.itemCard} key={item._id || item.id}>
                {/* ... existing card code ... */}
                <View style={styles.itemHeader}>
                  <MaterialIcons name="inventory-2" size={32} color="#0e7490" />
                  <View style={styles.itemHeaderText}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemDate}>Pending Review</Text>
                  </View>
                </View>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <View style={styles.submitterInfo}>
                  <View style={styles.infoRow}>
                    <Ionicons name="person" size={16} color="#666" />
                    <Text style={styles.infoLabel}>Name:</Text>
                    <Text style={styles.infoValue}>{item.reporterName}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="call" size={16} color="#666" />
                    <Text style={styles.infoLabel}>Contact:</Text>
                    <Text style={styles.infoValue}>{item.reporterContact}</Text>
                  </View>
                </View>
                {item.image && <Image source={{ uri: item.image }} style={styles.itemImage} />}
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.approveButton} onPress={() => handleApprove(item._id || item.id)}>
                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                    <Text style={styles.approveButtonText}>Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.rejectButton} onPress={() => handleReject(item._id || item.id)}>
                    <Ionicons name="close-circle" size={20} color="#fff" />
                    <Text style={styles.rejectButtonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )
        })()
        ) : viewMode === 'claims' ? (
          (() => {
            const itemsWithClaims = allItems.filter((it) => {
              const query = searchQuery.toLowerCase();
              const matchesSearch = (it.name || '').toLowerCase().includes(query) || (it.description || '').toLowerCase().includes(query);
              const matchesCat = selectedCategory === 'All' || (it.category || '').toLowerCase().includes(selectedCategory.toLowerCase());
              return Array.isArray(it.claims) && it.claims.length > 0 && it.status === 'approved' && matchesSearch && matchesCat;
            });
            return itemsWithClaims.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="sad-outline" size={64} color="#0e7490" style={styles.emptyIcon} />
                <Text style={styles.emptyText}>No claims yet</Text>
                <Text style={styles.emptySubtext}>No user claims have been recorded</Text>
              </View>
            ) : (
              itemsWithClaims.map((item) => (
                <View style={styles.itemCard} key={item._id || item.id}>
                  <View style={styles.itemHeader}>
                    <MaterialIcons name="inventory-2" size={32} color="#0e7490" />
                    <View style={styles.itemHeaderText}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemDate}>Last Claim: {item.claims?.length > 0 ? new Date(item.claims[item.claims.length - 1].timestamp).toLocaleDateString() : 'N/A'}</Text>
                    </View>
                    <View style={styles.claimBadge}>
                      <Text style={styles.claimBadgeText}>{item.claims.length}</Text>
                    </View>
                  </View>
                  <Text style={styles.itemDescription} numberOfLines={2}>{item.description}</Text>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      style={styles.primaryButton} 
                      onPress={() => navigation.navigate('AdminItemDetail', { item })}
                    >
                      <Ionicons name="eye" size={18} color="#fff" style={{ marginRight: 6 }} />
                      <Text style={styles.approveButtonText}>View {item.claims.length} Claims</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            );
          })()
        ) : (
          // archive view
          (() => {
            const archiveItems = allItems.filter(it => {
              const query = searchQuery.toLowerCase();
              const matchesSearch = (it.name || '').toLowerCase().includes(query) || (it.description || '').toLowerCase().includes(query);
              const matchesCat = selectedCategory === 'All' || (it.category || '').toLowerCase().includes(selectedCategory.toLowerCase());
              return (it.status === 'approved' || it.status === 'claimed') && matchesSearch && matchesCat;
            });
            return archiveItems.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="archive-outline" size={64} color="#0e7490" style={styles.emptyIcon} />
                <Text style={styles.emptyText}>Archive is empty</Text>
                <Text style={styles.emptySubtext}>No approved items yet</Text>
              </View>
            ) : (
              archiveItems.map((item) => (
                <TouchableOpacity 
                  style={styles.itemCard} 
                  key={item._id || item.id}
                  onPress={() => navigation.navigate('AdminItemDetail', { item })}
                >
                  <View style={styles.itemHeader}>
                    <MaterialIcons name="inventory-2" size={32} color="#0e7490" />
                    <View style={styles.itemHeaderText}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                    </View>
                    <View style={[
                      styles.statusBadge, 
                      { backgroundColor: item.status === 'claimed' ? '#16a34a' : '#0e7490' }
                    ]}>
                      <Text style={styles.statusBadgeText}>
                        {item.status === 'claimed' ? 'Claimed' : 'Available'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.itemDescription} numberOfLines={1}>{item.description}</Text>
                  {item.status === 'claimed' && (
                    <View style={styles.claimedInfo}>
                      <Ionicons name="person-circle" size={16} color="#16a34a" />
                      <Text style={styles.claimedText}>
                        Collected by {item.claimedBy} on {item.claimedAt ? new Date(item.claimedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : (item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : new Date(item.createdAt).toLocaleDateString())}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))
            );
          })()
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#0e7490', paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.9)' },
  logoutButton: { padding: 8 },
  statsContainer: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', paddingVertical: 12, paddingHorizontal: 5, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: 'transparent' },
  statCardActive: { backgroundColor: 'rgba(255,255,255,0.3)', borderColor: 'rgba(255,255,255,0.5)' },
  statNumber: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 2 },
  statLabel: { color: 'rgba(255,255,255,0.9)', fontSize: 11, fontWeight: '600' },
  searchSection: { marginTop: 5 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, paddingHorizontal: 12, height: 44, marginBottom: 12 },
  searchInput: { flex: 1, color: '#fff', fontSize: 15, paddingHorizontal: 10 },
  categoryScroll: { flexDirection: 'row' },
  categoryBtn: { paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', marginRight: 8, height: 32 },
  categoryBtnActive: { backgroundColor: '#fff' },
  categoryBtnText: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600' },
  categoryBtnTextActive: { color: '#0e7490' },
  content: { flex: 1, padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  itemCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  itemHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, gap: 12 },
  itemHeaderText: { flex: 1 },
  itemName: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 2 },
  itemDate: { fontSize: 12, color: '#ff9800', fontWeight: '600' },
  itemDescription: { fontSize: 14, color: '#666', marginBottom: 15, lineHeight: 20 },
  submitterInfo: { backgroundColor: '#f8f9fa', padding: 12, borderRadius: 8, marginBottom: 15 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5, gap: 6 },
  infoLabel: { fontSize: 13, color: '#666', fontWeight: '600' },
  infoValue: { fontSize: 13, color: '#333', flex: 1 },
  itemImage: { width: '100%', height: 200, borderRadius: 12, marginBottom: 15 },
  actionButtons: { flexDirection: 'row', gap: 12 },
  approveButton: { flex: 1, backgroundColor: '#16a34a', paddingVertical: 12, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  approveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  rejectButton: { flex: 1, backgroundColor: '#dc2626', paddingVertical: 12, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  rejectButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  primaryButton: { flex: 1, backgroundColor: '#0e7490', paddingVertical: 12, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  claimBadge: { backgroundColor: '#dc2626', minWidth: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6 },
  claimBadgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  claimedInfo: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  claimedText: { color: '#16a34a', fontSize: 12, fontWeight: '600' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { marginBottom: 20 },
  emptyText: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: '#666' },
});

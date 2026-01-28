import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Platform, ActivityIndicator } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function AdminDashboardScreen({ navigation, route }) {
  const { token: ctxToken, admin: ctxAdmin, signOut } = useContext(AuthContext);
  const initialToken = route?.params?.token || ctxToken || null;
  const [token, setToken] = useState(initialToken);
  const [pendingItems, setPendingItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_BASE = Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000';

  useEffect(() => {
    // load token from secure store if not provided in route
    const init = async () => {
      if (!token) {
        try {
          const stored = await SecureStore.getItemAsync('adminToken');
          if (stored) setToken(stored);
        } catch (e) {
          console.warn('Failed to read token from secure store', e);
        }
      }
      // fetch items after token resolved
      await fetchItems();
    };
    init();
  }, []);

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
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{pendingItems.length}</Text>
            <Text style={styles.statLabel}>Pending Review</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Approved Today</Text>
          </View>
        </View>
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Pending Items</Text>
        {loading ? (
          <View style={{ paddingVertical: 40 }}>
            <ActivityIndicator size="large" color="#0e7490" />
          </View>
        ) : pendingItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-done" size={64} color="#0e7490" style={styles.emptyIcon} />
            <Text style={styles.emptyText}>All caught up!</Text>
            <Text style={styles.emptySubtext}>No pending items to review</Text>
          </View>
        ) : (
          pendingItems.map((item) => (
            <View style={styles.itemCard} key={item._id || item.id}>
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
  statsContainer: { flexDirection: 'row', gap: 15 },
  statCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.2)', padding: 15, borderRadius: 12, alignItems: 'center' },
  statNumber: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 5 },
  statLabel: { color: 'rgba(255,255,255,0.9)', fontSize: 12 },
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
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { marginBottom: 20 },
  emptyText: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: '#666' },
});

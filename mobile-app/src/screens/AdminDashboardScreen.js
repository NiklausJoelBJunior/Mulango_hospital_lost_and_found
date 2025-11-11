import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function AdminDashboardScreen({ navigation }) {
  const [pendingItems, setPendingItems] = useState([
    { id: 1, itemName: 'Black Wallet', description: 'Leather wallet with credit cards inside', submittedBy: 'John Doe', contact: '+1234567890', image: null, status: 'pending' },
    { id: 2, itemName: 'iPhone 13', description: 'Blue iPhone 13 with cracked screen', submittedBy: 'Jane Smith', contact: 'jane@email.com', image: null, status: 'pending' },
    { id: 3, itemName: 'Car Keys', description: 'Toyota keys with red keychain', submittedBy: 'Mike Johnson', contact: '+9876543210', image: null, status: 'pending' },
  ]);

  const handleApprove = (itemId) => {
    Alert.alert('Approve Item', 'Are you sure you want to approve this item?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Approve', onPress: () => { setPendingItems(items => items.filter(item => item.id !== itemId)); Alert.alert('Success', 'Item approved.'); } },
    ]);
  };

  const handleReject = (itemId) => {
    Alert.alert('Reject Item', 'Are you sure you want to reject this item?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reject', style: 'destructive', onPress: () => { setPendingItems(items => items.filter(item => item.id !== itemId)); Alert.alert('Success', 'Item rejected.'); } },
    ]);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: () => navigation.replace('Main') },
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
        {pendingItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-done" size={64} color="#0e7490" style={styles.emptyIcon} />
            <Text style={styles.emptyText}>All caught up!</Text>
            <Text style={styles.emptySubtext}>No pending items to review</Text>
          </View>
        ) : (
          pendingItems.map((item) => (
            <View style={styles.itemCard} key={item.id}>
              <View style={styles.itemHeader}>
                <MaterialIcons name="inventory-2" size={32} color="#0e7490" />
                <View style={styles.itemHeaderText}>
                  <Text style={styles.itemName}>{item.itemName}</Text>
                  <Text style={styles.itemDate}>Pending Review</Text>
                </View>
              </View>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <View style={styles.submitterInfo}>
                <View style={styles.infoRow}>
                  <Ionicons name="person" size={16} color="#666" />
                  <Text style={styles.infoLabel}>Name:</Text>
                  <Text style={styles.infoValue}>{item.submittedBy}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="call" size={16} color="#666" />
                  <Text style={styles.infoLabel}>Contact:</Text>
                  <Text style={styles.infoValue}>{item.contact}</Text>
                </View>
              </View>
              {item.image && <Image source={{ uri: item.image }} style={styles.itemImage} />}
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.approveButton} onPress={() => handleApprove(item.id)}>
                  <Ionicons name="checkmark-circle" size={20} color="#fff" />
                  <Text style={styles.approveButtonText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rejectButton} onPress={() => handleReject(item.id)}>
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

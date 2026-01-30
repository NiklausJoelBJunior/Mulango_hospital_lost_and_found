import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import Config from '../config';

const { width } = Dimensions.get('window');

export default function AdminItemDetailScreen({ route, navigation }) {
  const { item: initialItem = {} } = route.params || {};
  const [item, setItem] = useState(initialItem);
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);

  const API_BASE = Config.API_BASE;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'N/A';
    return d.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
  };

  const getCategoryIcon = (category) => {
    const c = (category || '').toLowerCase();
    if (c.includes('electronic')) return 'phone-portrait';
    if (c.includes('personal')) return 'briefcase';
    if (c.includes('accessory')) return 'glasses';
    if (c.includes('document')) return 'document-text';
    if (c.includes('clothing')) return 'shirt';
    return 'cube';
  };

  const handleGiveOwnership = (claim) => {
    Alert.alert(
      'Give Ownership',
      `Are you sure you want to give ownership of this item to ${claim.name || claim.fullName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => performOwnershipTransfer(claim) 
        },
      ]
    );
  };

  const performOwnershipTransfer = async (claim) => {
    setLoading(true);
    try {
      const itemId = item._id || item.id;
      const headers = { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      const res = await fetch(`${API_BASE}/items/${itemId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ 
          status: 'claimed',
          claimedBy: claim.name || claim.fullName,
          claimedContact: claim.contact
        }),
      });

      if (!res.ok) throw new Error('Failed to update status');
      
      const updated = await res.json();
      setItem(updated);
      Alert.alert('Success', 'Ownership has been transferred successfully!');
    } catch (err) {
      console.error('Transfer error', err);
      Alert.alert('Error', 'Could not transfer ownership.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to permanently delete this item from the database? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: performDelete 
        },
      ]
    );
  };

  const performDelete = async () => {
    setLoading(true);
    try {
      const itemId = item._id || item.id;
      const headers = { 
        'Authorization': `Bearer ${token}`
      };
      
      const res = await fetch(`${API_BASE}/items/${itemId}`, {
        method: 'DELETE',
        headers
      });

      if (!res.ok) throw new Error('Failed to delete item');
      
      Alert.alert('Deleted', 'Item has been removed successfully.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      console.error('Delete error', err);
      Alert.alert('Error', 'Could not delete item.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0e7490" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Claim Details</Text>
        <View style={[
          styles.statusHeaderBadge, 
          { backgroundColor: item.status === 'claimed' ? '#16a34a' : (item.status === 'approved' ? '#fff' : '#d97706') }
        ]}>
          <Text style={[
            styles.statusHeaderBadgeText,
            { color: item.status === 'approved' ? '#0e7490' : '#fff' }
          ]}>
            {item.status === 'claimed' ? 'Claimed' : (item.status === 'approved' ? 'Available' : 'Pending')}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.deleteButton} 
            onPress={handleDelete}
            disabled={loading}
          >
            <Ionicons name="trash-outline" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={styles.placeholder} />
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Item Image */}
        <View style={styles.imageSection}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="cover" />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name={getCategoryIcon(item.category)} size={64} color="#94A3B8" />
              <Text style={styles.noImageText}>No Image Available</Text>
            </View>
          )}
        </View>

        {/* Item Information */}
        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>Item Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name:</Text>
              <Text style={styles.infoValue}>{item.name || 'Unknown'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Category:</Text>
              <Text style={styles.infoValue}>{item.category || 'Uncategorized'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Found at:</Text>
              <Text style={styles.infoValue}>{item.location || 'Unknown location'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Reported on:</Text>
              <Text style={styles.infoValue}>{formatDate(item.createdAt)}</Text>
            </View>
            {item.status === 'claimed' && (
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: '#16a34a' }]}>Claimed on:</Text>
                <Text style={[styles.infoValue, { color: '#16a34a', fontWeight: 'bold' }]}>
                  {formatDate(item.claimedAt || item.updatedAt || item.createdAt)}
                </Text>
              </View>
            )}
            <View style={styles.descriptionRow}>
              <Text style={styles.infoLabel}>Description:</Text>
              <Text style={styles.descriptionText}>{item.description || 'No description provided.'}</Text>
            </View>
          </View>

          {/* Owner Information (if claimed) */}
          {item.status === 'claimed' && (
            <>
              <Text style={styles.sectionTitle}>Owner Information (Item Collected)</Text>
              <View style={[styles.infoCard, { borderColor: '#16a34a', borderLeftWidth: 4 }]}>
                <View style={styles.infoRow}>
                  <Ionicons name="person-circle" size={18} color="#16a34a" />
                  <Text style={styles.infoLabel}>Owner Name:</Text>
                  <Text style={[styles.infoValue, { color: '#16a34a', fontWeight: 'bold' }]}>{item.claimedBy || 'Unknown'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="call" size={18} color="#16a34a" />
                  <Text style={styles.infoLabel}>Contact:</Text>
                  <Text style={styles.infoValue}>{item.claimedContact || 'Not provided'}</Text>
                </View>
                {item.claimedAt && (
                  <View style={styles.infoRow}>
                    <Ionicons name="time" size={18} color="#16a34a" />
                    <Text style={styles.infoLabel}>Claimed on:</Text>
                    <Text style={styles.infoValue}>{formatDate(item.claimedAt || item.updatedAt || item.createdAt)}</Text>
                  </View>
                )}
                <View style={[styles.ownerLabelBadge, { marginTop: 10 }]}>
                  <Ionicons name="checkmark-seal" size={16} color="#fff" />
                  <Text style={styles.ownerLabelBadgeText}>Officially Collected</Text>
                </View>
              </View>
            </>
          )}

          {/* Poster Information */}
          <Text style={styles.sectionTitle}>Reporter Information (Poster)</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="person" size={18} color="#0e7490" />
              <Text style={styles.infoLabel}>Name:</Text>
              <Text style={styles.infoValue}>{item.reporterName || item.yourName || 'Unknown'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="call" size={18} color="#0e7490" />
              <Text style={styles.infoLabel}>Contact:</Text>
              <Text style={styles.infoValue}>{item.reporterContact || item.contact || 'Not provided'}</Text>
            </View>
          </View>

          {/* Claims List / Registry */}
          <Text style={styles.sectionTitle}>
            {item.status === 'claimed' ? 'Claim Registry (Record History)' : `All Claims (${item.claims?.length || 0})`}
          </Text>
          {item.claims && item.claims.length > 0 ? (
            item.claims.map((claim, index) => (
              <View key={index} style={[
                styles.claimCard, 
                item.status === 'claimed' && item.claimedBy === (claim.name || claim.fullName) && { borderColor: '#16a34a', borderLeftWidth: 6 }
              ]}>
                <View style={styles.claimHeader}>
                  <Text style={styles.claimantName}>{claim.name || claim.fullName || 'Anonymous Claimant'}</Text>
                  <Text style={styles.claimDate}>{formatDate(claim.timestamp)}</Text>
                </View>
                <View style={styles.claimInfo}>
                  <Ionicons name="call-outline" size={16} color="#666" />
                  <Text style={styles.claimContact}>{claim.contact || 'No contact info'}</Text>
                </View>
                {item.status !== 'claimed' && (
                  <TouchableOpacity 
                    style={styles.giveOwnershipButton} 
                    onPress={() => handleGiveOwnership(claim)}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <>
                        <Ionicons name="hand-right" size={16} color="#fff" />
                        <Text style={styles.giveOwnershipText}>Give Ownership</Text>
                      </>
                    )}
                  </TouchableOpacity>
                )}
                {item.status === 'claimed' && item.claimedBy === (claim.name || claim.fullName) && (
                  <View style={styles.ownerBadge}>
                    <Ionicons name="checkmark-seal" size={16} color="#16a34a" />
                    <Text style={styles.ownerBadgeText}>Reclaimed</Text>
                  </View>
                )}
              </View>
            ))
          ) : (
            <View style={styles.emptyClaims}>
              <Text style={styles.emptyClaimsText}>No claims have been submitted for this item yet.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { height: 100, backgroundColor: '#0e7490', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 40 },
  backButton: { padding: 8 },
  headerTitle: { flex: 1, color: '#fff', fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  statusHeaderBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginRight: 10 },
  statusHeaderBadgeText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  deleteButton: { padding: 8, marginRight: -8 },
  placeholder: { width: 10 },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  imageSection: { width: '100%', height: 250, backgroundColor: '#e2e8f0' },
  itemImage: { width: '100%', height: '100%' },
  placeholderImage: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  noImageText: { color: '#94a3b8', marginTop: 10, fontWeight: '500' },
  contentSection: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginTop: 20, marginBottom: 12 },
  infoCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  infoLabel: { fontSize: 14, color: '#64748b', fontWeight: '600', width: 100 },
  infoValue: { fontSize: 14, color: '#1e293b', fontWeight: '500', flex: 1 },
  descriptionRow: { marginTop: 4 },
  descriptionText: { fontSize: 14, color: '#475569', lineHeight: 22, marginTop: 4 },
  claimCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: '#0e7490', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  claimHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  claimantName: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  claimDate: { fontSize: 12, color: '#64748b' },
  claimInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  claimContact: { fontSize: 13, color: '#475569' },
  giveOwnershipButton: { 
    backgroundColor: '#0e7490', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 10, 
    borderRadius: 8, 
    marginTop: 12,
    gap: 8
  },
  giveOwnershipText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  ownerBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6, 
    marginTop: 12, 
    padding: 8, 
    backgroundColor: '#f0fdf4', 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dcfce7'
  },
  ownerBadgeText: { color: '#16a34a', fontWeight: 'bold', fontSize: 13 },
  ownerLabelBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16a34a', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, alignSelf: 'flex-start', gap: 6 },
  ownerLabelBadgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  emptyClaims: { padding: 20, alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, borderStyle: 'dashed', borderWidth: 1, borderColor: '#cbd5e1' },
  emptyClaimsText: { color: '#64748b', fontSize: 14, textAlign: 'center' },
});

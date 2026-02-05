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
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
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
    if (c.includes('electronic')) return 'cellphone-link';
    if (c.includes('personal')) return 'bag-personal';
    if (c.includes('accessory')) return 'glasses';
    if (c.includes('document')) return 'file-document';
    if (c.includes('clothing')) return 'tshirt-crew';
    return 'cube-outline';
  };

  const handleGiveOwnership = (claim) => {
    Alert.alert(
      'Verify Ownership',
      `By proceeding, you confirm that ${claim.name || claim.fullName} has provided sufficient proof of ownership.\n\nMark this item as collected?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes, Hand Over', onPress: () => performOwnershipTransfer(claim) },
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
      Alert.alert('Ownership Transferred', 'The registry has been updated. Item is marked as Collected.');
    } catch (err) {
      Alert.alert('Error', 'Could not transfer ownership.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Record',
      'Are you sure you want to permanently remove this item? This action is irreversible.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: performDelete },
      ]
    );
  };

  const performDelete = async () => {
    setLoading(true);
    try {
      const itemId = item._id || item.id;
      const res = await fetch(`${API_BASE}/items/${itemId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'Could not delete record.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'claimed': return '#0EA5E9';
      case 'approved': return '#10B981';
      case 'rejected': return '#EF4444';
      default: return '#F59E0B';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <ScrollView style={styles.scrollView} bounces={false}>
        {/* Banner Section */}
        <View style={styles.bannerContainer}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.bannerImage} />
          ) : (
            <View style={styles.bannerPlaceholder}>
              <Image 
                source={require('../../assets/logo.png')} 
                style={[styles.placeholderLogo, { tintColor: '#CBD5E1' }]} 
                resizeMode="contain"
              />
            </View>
          )}
          <LinearGradient colors={['transparent', 'rgba(15, 23, 42, 0.9)']} style={styles.bannerOverlay} />
          
          <TouchableOpacity style={styles.backFab} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.statusBadgeText}>{item.status.toUpperCase()}</Text>
            </View>
            <Text style={styles.itemName}>{item.name}</Text>
          </View>
        </View>

        <View style={styles.meatContent}>
          {/* Action Row */}
          <View style={styles.actionPanel}>
             <TouchableOpacity style={styles.panelBtn} onPress={handleDelete}>
               <Feather name="trash-2" size={20} color="#EF4444" />
               <Text style={[styles.panelBtnText, { color: '#EF4444' }]}>Delete</Text>
             </TouchableOpacity>
          </View>

          {/* Core Info */}
          <View style={styles.infoSection}>
            <View style={styles.infoCard}>
              <View style={styles.infoItem}>
                <View style={styles.iconCircle}>
                  <MaterialCommunityIcons name="map-marker-outline" size={22} color="#0EA5E9" />
                </View>
                <View>
                  <Text style={styles.infoLabel}>Found At</Text>
                  <Text style={styles.infoValue}>{item.location}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoItem}>
                <View style={styles.iconCircle}>
                  <MaterialCommunityIcons name="clock-outline" size={22} color="#0EA5E9" />
                </View>
                <View>
                  <Text style={styles.infoLabel}>Reported Date</Text>
                  <Text style={styles.infoValue}>{formatDate(item.createdAt)}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoItem}>
                <View style={styles.iconCircle}>
                  <MaterialCommunityIcons name="account-search-outline" size={22} color="#0EA5E9" />
                </View>
                <View>
                  <Text style={styles.infoLabel}>Reported By</Text>
                  <Text style={styles.infoValue}>{item.reporterName || item.yourName || 'Staff Member'}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <View style={styles.descCard}>
              <Text style={styles.descText}>{item.description || 'No detailed description provided.'}</Text>
            </View>
          </View>

          {/* Claim Management */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Active Claims</Text>
              <View style={styles.claimsCountBadge}>
                <Text style={styles.claimsCountText}>{item.claims?.length || 0}</Text>
              </View>
            </View>

            {item.status === 'claimed' && (
              <View style={styles.resolvedCard}>
                <LinearGradient colors={['#0EA5E9', '#0284C7']} style={styles.resolvedLabel}>
                  <Feather name="check-circle" size={16} color="#fff" />
                  <Text style={styles.resolvedLabelText}>RESOLVED</Text>
                </LinearGradient>
                <View style={styles.resolvedContent}>
                  <Text style={styles.resolvedTitle}>Item collected by:</Text>
                  <Text style={styles.resolvedName}>{item.claimedBy}</Text>
                  <Text style={styles.resolvedContact}>{item.claimedContact}</Text>
                  {item.claimedAt && (
                    <View style={styles.claimedAtRow}>
                       <Feather name="calendar" size={12} color="#0EA5E9" />
                       <Text style={styles.claimedAtText}>Claimed: {formatDate(item.claimedAt)}</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {item.claims && item.claims.length > 0 ? (
              item.claims.map((claim, idx) => (
                <View key={idx} style={styles.claimEntry}>
                  <View style={styles.claimMain}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{(claim.name?.[0] || claim.fullName?.[0] || 'A').toUpperCase()}</Text>
                    </View>
                    <View style={styles.claimDetails}>
                      <Text style={styles.claimantName}>{claim.name || claim.fullName}</Text>
                      <Text style={styles.claimTime}>{formatDate(claim.timestamp)}</Text>
                      <View style={styles.claimContactRow}>
                        <Feather name="phone" size={12} color="#64748B" />
                        <Text style={styles.claimContactText}>{claim.contact}</Text>
                      </View>
                    </View>
                  </View>
                  
                  {item.status !== 'claimed' && (
                    <TouchableOpacity 
                      style={styles.verifyBtn}
                      onPress={() => handleGiveOwnership(claim)}
                    >
                      <Text style={styles.verifyBtnText}>Verify & Transfer</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))
            ) : (
              <View style={styles.emptyClaims}>
                <Feather name="users" size={32} color="#CBD5E1" />
                <Text style={styles.emptyText}>No claims submitted yet</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollView: { flex: 1 },
  bannerContainer: { height: 320, width: '100%', position: 'relative' },
  bannerImage: { width: '100%', height: '100%' },
  bannerPlaceholder: { width: '100%', height: '100%', backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  placeholderLogo: { width: 100, height: 100 },
  bannerOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 160 },
  backFab: { position: 'absolute', top: 50, left: 20, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(15, 23, 42, 0.5)', justifyContent: 'center', alignItems: 'center' },
  headerContent: { position: 'absolute', bottom: 25, left: 20, right: 20 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, marginBottom: 10 },
  statusBadgeText: { color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  itemName: { color: '#fff', fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  
  meatContent: { marginTop: -20, backgroundColor: '#F8FAFC', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20 },
  actionPanel: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 20, padding: 15, marginBottom: 25, justifyContent: 'space-around', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
  panelBtn: { alignItems: 'center', gap: 6 },
  panelBtnText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  
  infoSection: { marginBottom: 25 },
  infoCard: { backgroundColor: '#fff', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9' },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  iconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F0F9FF', justifyContent: 'center', alignItems: 'center' },
  infoLabel: { fontSize: 12, fontWeight: '600', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 },
  infoValue: { fontSize: 16, fontWeight: '700', color: '#1E293B', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 15, marginLeft: 60 },
  
  section: { marginBottom: 25 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  claimsCountBadge: { backgroundColor: '#E2E8F0', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  claimsCountText: { fontSize: 12, fontWeight: '700', color: '#475569' },
  
  descCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#F1F5F9' },
  descText: { fontSize: 15, color: '#475569', lineHeight: 24 },
  
  claimEntry: { backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  claimMain: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#0EA5E9', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  claimDetails: { flex: 1, marginLeft: 16 },
  claimantName: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  claimTime: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  claimContactRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  claimContactText: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  verifyBtn: { backgroundColor: '#0F172A', borderRadius: 12, paddingVertical: 10, alignItems: 'center', marginTop: 15 },
  verifyBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  
  resolvedCard: { backgroundColor: '#F0F9FF', borderRadius: 20, overflow: 'hidden', marginBottom: 20, borderWidth: 1, borderColor: '#BAE6FD' },
  resolvedLabel: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, paddingHorizontal: 15 },
  resolvedLabelText: { color: '#fff', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  resolvedContent: { padding: 20 },
  resolvedTitle: { fontSize: 13, color: '#0EA5E9', fontWeight: '600' },
  resolvedName: { fontSize: 20, fontWeight: '800', color: '#1E293B', marginTop: 4 },
  resolvedContact: { fontSize: 14, color: '#0369A1', marginTop: 2 },
  claimedAtRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(14, 165, 233, 0.1)' },
  claimedAtText: { fontSize: 12, color: '#0EA5E9', fontWeight: '600' },
  
  emptyClaims: { height: 120, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 20, borderStyle: 'dashed', borderWidth: 2, borderColor: '#E2E8F0' },
  emptyText: { marginTop: 10, color: '#94A3B8', fontWeight: '600' }
});

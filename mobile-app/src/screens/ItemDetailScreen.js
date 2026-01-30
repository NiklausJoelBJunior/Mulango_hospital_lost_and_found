import React, { useState, useEffect } from 'react';
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
  Modal,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';

const { width } = Dimensions.get('window');

import Config from '../config';

export default function ItemDetailScreen({ route, navigation }) {
  const { item = {} } = route.params || {};
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimStep, setClaimStep] = useState('form');
  const [claimData, setClaimData] = useState({ fullName: '', contact: '' });
  
  const API_BASE = Config.API_BASE;

  useEffect(() => {
    if (route.params && route.params.openClaim) {
      setShowClaimModal(true);
    }
  }, [route.params]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const d = new Date(dateString);
    return d.toLocaleString();
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

  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'approved':
      case 'verified':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'rejected':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const handleClaimSubmit = () => {
    if (!claimData.fullName.trim() || !claimData.contact.trim()) {
      alert('Please fill in all fields');
      return;
    }
    // POST claim to backend with improved error handling and fallback
    (async () => {
      const id = item._id || item.id;
      const payload = { fullName: claimData.fullName, contact: claimData.contact };
      const tried = [];
      const candidates = [API_BASE];
      // also try localhost and 10.0.2.2 as fallbacks
      if (!candidates.includes('http://localhost:4000')) candidates.push('http://localhost:4000');
      if (!candidates.includes('http://10.0.2.2:4000')) candidates.push('http://10.0.2.2:4000');

      for (const base of candidates) {
        try {
          tried.push(base);
          const url = `${base}/items/${id}/claims`;
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (!res.ok) {
            const text = await res.text().catch(() => 'no body');
            throw new Error(`HTTP ${res.status} ${res.statusText} - ${text}`);
          }
          // success
          setClaimStep('success');
          return;
        } catch (err) {
          console.warn(`Claim submit failed for base=${base}`, err);
          // try next candidate
        }
      }
      // all attempts failed
      alert(`Could not submit claim. Tried: ${tried.join(', ')}. Check backend connectivity.`);
    })();
  };

  const handleCloseModal = () => {
    setShowClaimModal(false);
    setTimeout(() => {
      setClaimStep('form');
      setClaimData({ fullName: '', contact: '' });
    }, 200);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0EA5E9" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Item Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.mainInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.itemName}>{item.name || 'Unknown Item'}</Text>
            {item.status?.toLowerCase() === 'approved' && (
              <TouchableOpacity style={[styles.claimButtonTop, styles.claimButtonAbsolute]} onPress={() => setShowClaimModal(true)}>
                <Ionicons name="checkmark-circle" size={18} color="#fff" />
                <Text style={styles.claimButtonTopText}>Claim</Text>
              </TouchableOpacity>
            )}
          </View>

          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="cover" />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name={getCategoryIcon(item.category)} size={64} color="#94A3B8" />
              <Text style={styles.noImageText}>No Image Available</Text>
            </View>
          )}
        </View>

        <View style={styles.detailSection}>
          <View style={styles.titleRow}>
            <Text style={styles.itemName}>{item.name || 'Unknown Item'}</Text>
            {item.status?.toLowerCase() === 'approved' && (
              <TouchableOpacity style={[styles.claimButtonTop, styles.claimButtonBadge]} onPress={() => setShowClaimModal(true)}>
                <Ionicons name="checkmark-circle" size={18} color="#fff" />
                <Text style={styles.claimButtonTopText}>Claim</Text>
              </TouchableOpacity>
            )}
          </View>

          {item.category && (
            <View style={styles.categoryRow}>
              <Ionicons name={getCategoryIcon(item.category)} size={16} color="#0EA5E9" />
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          )}

          {item.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{item.description}</Text>
            </View>
          )}

          <View style={styles.infoSection}>
            <View style={styles.infoCard}>
              <Ionicons name="location" size={24} color="#0EA5E9" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Found Location</Text>
                <Text style={styles.infoValue}>{item.location || 'Location not specified'}</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <Ionicons name="time" size={24} color="#0EA5E9" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Date & Time</Text>
                <Text style={styles.infoValue}>{formatDate(item.createdAt)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.actionButtonsRow}>
            <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('ContactSupport', { item })}>
              <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>Contact Support</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
              <Text style={styles.secondaryButtonText}>Back to Search</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal visible={showClaimModal} animationType="slide" transparent onRequestClose={handleCloseModal}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={handleCloseModal} />
          <View style={styles.modalContent}>
            {claimStep === 'form' ? (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Claim Item</Text>
                  <TouchableOpacity onPress={handleCloseModal}><Ionicons name="close" size={28} color="#6B7280" /></TouchableOpacity>
                </View>

                <ScrollView>
                  <Text style={styles.modalSubtitle}>Please provide your information to claim this item</Text>
                  <View style={styles.formGroup}>
                    <Text style={styles.inputLabel}>Full Name *</Text>
                    <TextInput style={styles.input} placeholder="Enter your full name" value={claimData.fullName} onChangeText={(t) => setClaimData({ ...claimData, fullName: t })} placeholderTextColor="#9CA3AF" />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.inputLabel}>Contact Number *</Text>
                    <TextInput style={styles.input} placeholder="Enter your phone number" value={claimData.contact} onChangeText={(t) => setClaimData({ ...claimData, contact: t })} keyboardType="phone-pad" placeholderTextColor="#9CA3AF" />
                  </View>

                  <TouchableOpacity style={styles.submitButton} onPress={handleClaimSubmit}><Text style={styles.submitButtonText}>Submit Claim</Text></TouchableOpacity>
                </ScrollView>
              </>
            ) : (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Claim Submitted!</Text>
                  <TouchableOpacity onPress={handleCloseModal}><Ionicons name="close" size={28} color="#6B7280" /></TouchableOpacity>
                </View>
                <ScrollView>
                  <View style={styles.successIcon}><Ionicons name="checkmark-circle" size={80} color="#10B981" /></View>
                  <Text style={styles.successTitle}>Your claim has been recorded!</Text>
                  <Text style={styles.successSubtitle}>Please pick up at the Lost & Found office.</Text>
                  <TouchableOpacity style={styles.doneButton} onPress={handleCloseModal}><Text style={styles.doneButtonText}>Done</Text></TouchableOpacity>
                </ScrollView>
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { height: 56, backgroundColor: '#0EA5E9', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
  backButton: { padding: 6 },
  headerTitle: { flex: 1, color: '#fff', fontSize: 18, fontWeight: '700', textAlign: 'center' },
  placeholder: { width: 40 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  mainInfo: { marginBottom: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', position: 'relative' },
  itemName: { fontSize: 20, fontWeight: '700', color: '#0F172A', paddingRight: 92 },
  claimButtonTop: { backgroundColor: '#0EA5E9', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  claimButtonTopText: { color: '#fff', marginLeft: 6, fontWeight: '700' },
  
  claimButtonAbsolute: { position: 'absolute', right: 0, top: 0, height: '100%', justifyContent: 'center' },
  claimButtonBadge: { backgroundColor: '#0EA5E9', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  itemImage: { width: width - 32, height: 200, borderRadius: 12, marginTop: 12 },
  placeholderImage: { height: 200, borderRadius: 12, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  noImageText: { color: '#94A3B8', marginTop: 8 },
  detailSection: { marginTop: 12 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  statusText: { color: '#fff', fontWeight: '700' },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  categoryText: { marginLeft: 8, color: '#475569' },
  descriptionSection: { marginTop: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  descriptionText: { color: '#374151' },
  infoSection: { marginTop: 12 },
  infoCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  infoContent: { marginLeft: 12 },
  infoLabel: { color: '#6B7280', fontSize: 12 },
  infoValue: { color: '#0F172A', fontWeight: '600' },
  actionButtonsRow: { flexDirection: 'row', gap: 8, marginTop: 16, justifyContent: 'space-between' },
  primaryButton: { flex: 1, backgroundColor: '#0EA5E9', padding: 12, borderRadius: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  primaryButtonText: { color: '#fff', marginLeft: 8, fontWeight: '700' },
  secondaryButton: { marginLeft: 8, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
  secondaryButtonText: { color: '#0F172A' },

  /* Modal */
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject },
  modalContent: { backgroundColor: '#fff', padding: 16, borderTopLeftRadius: 12, borderTopRightRadius: 12, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  modalSubtitle: { color: '#475569', marginVertical: 12 },
  formGroup: { marginBottom: 12 },
  inputLabel: { color: '#6B7280', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#E6E7E8', padding: 10, borderRadius: 8, color: '#0F172A' },
  submitButton: { backgroundColor: '#0EA5E9', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 6 },
  submitButtonText: { color: '#fff', fontWeight: '700' },
  successIcon: { alignItems: 'center', marginVertical: 12 },
  successTitle: { fontSize: 16, fontWeight: '700', textAlign: 'center' },
  successSubtitle: { textAlign: 'center', color: '#475569', marginVertical: 8 },
  doneButton: { backgroundColor: '#0EA5E9', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 12 },
  doneButtonText: { color: '#fff', fontWeight: '700' },
});

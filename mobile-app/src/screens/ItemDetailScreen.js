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
  Alert,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';

const { width, height } = Dimensions.get('window');

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

  const handleShare = async () => {
    try {
      const message = `Check out this lost item found at the Hospital: ${item.name}. Location: ${item.location || 'Unknown'}. You can find it on the MLAF app.`;
      const result = await Share.share({
        message,
        url: item.image, // Optional URL
        title: `Lost Item: ${item.name}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to share this item');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.heroImage} resizeMode="cover" />
          ) : (
            <View style={styles.heroPlaceholder}>
              <Image 
                source={require('../../assets/logo.png')} 
                style={[styles.placeholderLogo, { tintColor: '#CBD5E1' }]} 
                resizeMode="contain"
              />
            </View>
          )}
          
          {/* Custom Header Overlay */}
          <View style={styles.headerOverlay}>
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={24} color="#1E293B" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={handleShare}
            >
              <Ionicons name="share-outline" size={22} color="#1E293B" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentCard}>
          <View style={styles.mainHeader}>
            <View style={styles.badgeRow}>
              {item.category && (
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{item.category}</Text>
                </View>
              )}
            </View>

            <Text style={styles.itemName}>{item.name || 'Unnamed Item'}</Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <View style={[styles.statIconCircle, { backgroundColor: '#F0F9FF' }]}>
                <Ionicons name="location" size={20} color="#0EA5E9" />
              </View>
              <View>
                <Text style={styles.statLabel}>Found At</Text>
                <Text style={styles.statValue} numberOfLines={1}>{item.location || 'Unknown'}</Text>
              </View>
            </View>

            <View style={styles.statBox}>
              <View style={[styles.statIconCircle, { backgroundColor: '#F0FDFA' }]}>
                <Ionicons name="time" size={20} color="#10B981" />
              </View>
              <View>
                <Text style={styles.statLabel}>Found On</Text>
                <Text style={styles.statValue}>{new Date(item.createdAt).toLocaleDateString()}</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsGroup}>
            <Text style={styles.groupTitle}>Description</Text>
            <Text style={styles.descriptionText}>
              {item.description || 'No description provided for this item.'}
            </Text>
          </View>

          {/* Safety Notice */}
          <View style={styles.noticeCard}>
            <Ionicons name="shield-checkmark" size={24} color="#0EA5E9" />
            <Text style={styles.noticeText}>
              To ensure safety, claims are verified by our team. Please have a valid ID ready.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Persistent Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.secondaryAction}
          onPress={() => Alert.alert(
            "How to get your item", 
            "After submitting your claim, please proceed to the Hospital Reception desk with a valid ID to verify and collect your item."
          )}
        >
          <Ionicons name="help-circle-outline" size={22} color="#64748B" />
        </TouchableOpacity>
        
        {item.status?.toLowerCase() === 'approved' ? (
          <TouchableOpacity 
            style={styles.primaryAction} 
            onPress={() => setShowClaimModal(true)}
          >
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.primaryActionText}>Claim this Item</Text>
          </TouchableOpacity>
        ) : (
          <View style={[styles.primaryAction, styles.disabledAction]}>
            <Text style={styles.primaryActionText}>Verification in Progress</Text>
          </View>
        )}
      </View>

      <Modal visible={showClaimModal} animationType="fade" transparent onRequestClose={handleCloseModal}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={handleCloseModal} />
          <View style={styles.modalContent}>
            <View style={styles.modalIndicator} />
            
            {claimStep === 'form' ? (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Claim Item</Text>
                  <TouchableOpacity onPress={handleCloseModal} style={styles.closeBtn}>
                    <Ionicons name="close" size={20} color="#64748B" />
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  <Text style={styles.modalSubtitle}>Please provide your information to claim this item. Our team will review your request.</Text>
                  
                  <View style={styles.formGroup}>
                    <Text style={styles.inputLabel}>Full Name</Text>
                    <TextInput 
                      style={styles.input} 
                      placeholder="e.g. John Doe" 
                      value={claimData.fullName} 
                      onChangeText={(t) => setClaimData({ ...claimData, fullName: t })} 
                      placeholderTextColor="#94A3B8" 
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.inputLabel}>Contact Number</Text>
                    <TextInput 
                      style={styles.input} 
                      placeholder="+1 (555) 000-0000" 
                      value={claimData.contact} 
                      onChangeText={(t) => setClaimData({ ...claimData, contact: t })} 
                      keyboardType="phone-pad" 
                      placeholderTextColor="#94A3B8" 
                    />
                  </View>

                  <TouchableOpacity style={styles.submitButton} onPress={handleClaimSubmit}>
                    <Text style={styles.submitButtonText}>Submit Claim Request</Text>
                  </TouchableOpacity>
                  
                  <Text style={styles.formFooter}>
                    By submitting, you agree to our terms regarding lost and found claims.
                  </Text>
                </ScrollView>
              </>
            ) : (
              <View style={styles.successContainer}>
                <View style={styles.successIcon}>
                  <Ionicons name="checkmark-circle" size={100} color="#10B981" />
                </View>
                <Text style={styles.successTitle}>Claim Submitted!</Text>
                <Text style={styles.successSubtitle}>
                  Your request has been recorded. Please proceed to the Hospital Reception desk with a valid ID to verify and collect your item.
                </Text>
                <TouchableOpacity style={styles.doneButton} onPress={handleCloseModal}>
                  <Text style={styles.doneButtonText}>Got it, thanks!</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },

  /* Hero Section */
  heroSection: {
    height: 380,
    width: '100%',
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderLogo: { width: 100, height: 100 },
  headerOverlay: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },

  /* Content Card */
  contentCard: {
    backgroundColor: '#fff',
    marginTop: -32,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 32,
    minHeight: height - 340,
  },
  mainHeader: {
    marginBottom: 24,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  categoryBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  itemName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 34,
  },

  /* Stats Grid */
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  statLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },

  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 24,
  },

  /* Details Groups */
  detailsGroup: {
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#475569',
  },

  /* Reporter Card */
  reporterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
  },
  /* Notice Card */
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  noticeText: {
    flex: 1,
    fontSize: 13,
    color: '#0369A1',
    lineHeight: 20,
    marginLeft: 12,
    fontWeight: '500',
  },

  /* Bottom Bar */
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 20,
  },
  primaryAction: {
    flex: 1,
    height: 56,
    backgroundColor: '#0EA5E9',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryActionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryAction: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  disabledAction: {
    backgroundColor: '#94A3B8',
  },

  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 12,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 44 : 32,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  modalIndicator: {
    width: 40,
    height: 5,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
    height: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    position: 'absolute',
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSubtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  formGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    height: 56,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  submitButton: {
    height: 56,
    backgroundColor: '#0EA5E9',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  formFooter: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 18,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 12,
  },
  successSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  doneButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#10B981',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

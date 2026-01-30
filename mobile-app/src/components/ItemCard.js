import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const getCategoryIcon = (category) => {
  const c = (category || '').toLowerCase();
  if (c.includes('electronic') || c.includes('electronics')) return 'phone-portrait-outline';
  if (c.includes('personal')) return 'briefcase-outline';
  if (c.includes('accessory') || c.includes('accessories')) return 'glasses-outline';
  if (c.includes('document')) return 'document-text-outline';
  if (c.includes('clothing')) return 'shirt-outline';
  return 'cube-outline';
};


export default function ItemCard({ item, navigation }) {
  const handlePress = () => navigation.navigate('ItemDetail', { item });
  const handleClaim = () => navigation.navigate('ItemDetail', { item, openClaim: true });

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.leftIcon}>
        <Ionicons name={getCategoryIcon(item.category)} size={20} color="#0EA5E9" />
      </View>

      <View style={styles.center}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={12} color="#6B7280" />
            <Text style={styles.metaText}>{item.location || 'Unknown'}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={12} color="#6B7280" />
            <Text style={styles.metaText}>{item.createdAt ? new Date(item.createdAt).toLocaleString() : (item.date || '')}</Text>
          </View>
        </View>
      </View>

      {item.status === 'approved' ? (
        <TouchableOpacity style={styles.claimBadge} onPress={handleClaim}>
          <Ionicons name="checkmark-circle" size={14} color="#fff" />
          <Text style={styles.claimText}>Claim</Text>
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#fff', borderRadius: 12, marginBottom: 12 },
  leftIcon: { width: 44, height: 44, borderRadius: 8, backgroundColor: '#F1F9FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  center: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 },
  metaItem: { flexDirection: 'row', alignItems: 'center' },
  metaText: { marginLeft: 6, color: '#6B7280', fontSize: 12 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: '600' },
  claimBadge: { backgroundColor: '#0EA5E9', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  claimText: { color: '#fff', marginLeft: 6, fontWeight: '700' },
});

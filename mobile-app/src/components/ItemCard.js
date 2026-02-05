import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const getCategoryIcon = (category) => {
  const c = (category || '').toLowerCase();
  if (c.includes('electronic') || c.includes('electronics')) return 'phone-portrait-outline';
  if (c.includes('personal')) return 'briefcase-outline';
  if (c.includes('accessory') || c.includes('accessories')) return 'glasses-outline';
  if (c.includes('document')) return 'document-text-outline';
  if (c.includes('clothing')) return 'shirt-outline';
  return 'cube-outline';
};


export default function ItemCard({ item, navigation, isGrid = false, showStatus = true }) {
  const handlePress = () => navigation.navigate('ItemDetail', { item });
  const handleClaim = () => navigation.navigate('ItemDetail', { item, openClaim: true });

  const formattedDate = item.createdAt 
    ? new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    : 'Recently';

  if (isGrid) {
    return (
      <TouchableOpacity 
        style={styles.gridCard} 
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <View style={styles.gridImageWrapper}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.gridImage} resizeMode="cover" />
          ) : (
            <View style={styles.gridPlaceholder}>
              <Image 
                source={require('../../assets/logo.png')} 
                style={[styles.placeholderLogo, { tintColor: '#CBD5E1' }]} 
                resizeMode="contain"
              />
            </View>
          )}
          
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.5)']}
            style={styles.gridGradient}
          />

          {showStatus && item.status === 'approved' && (
            <View style={styles.gridStatusPill}>
              <Text style={styles.gridStatusText}>Available</Text>
            </View>
          )}
        </View>

        <View style={styles.gridContent}>
          <Text style={styles.gridCategory} numberOfLines={1}>
            {item.category || 'General'}
          </Text>
          <Text style={styles.gridName} numberOfLines={1}>{item.name}</Text>
          
          <View style={styles.gridFooter}>
            <View style={styles.gridMeta}>
              <Ionicons name="location" size={12} color="#0EA5E9" />
              <Text style={styles.gridMetaText} numberOfLines={1}>
                {item.location || 'Unknown'}
              </Text>
            </View>
            <Text style={styles.gridDate}>{formattedDate}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={styles.imageContainer}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.listImage} resizeMode="cover" />
          ) : (
            <View style={styles.listPlaceholder}>
              <Image 
                source={require('../../assets/logo.png')} 
                style={[styles.placeholderLogoSmall, { tintColor: '#CBD5E1' }]} 
                resizeMode="contain"
              />
            </View>
          )}
        </View>

        <View style={styles.textContainer}>
          <View style={styles.listHeader}>
            <Text style={styles.listCategory}>{item.category || 'General'}</Text>
            <Text style={styles.listDate}>{formattedDate}</Text>
          </View>
          <Text style={styles.listName} numberOfLines={1}>{item.name}</Text>
          
          <View style={styles.listMetaRow}>
            <View style={styles.listMetaItem}>
              <Ionicons name="location" size={12} color="#94A3B8" />
              <Text style={styles.listMetaText} numberOfLines={1}>{item.location || 'Unknown'}</Text>
            </View>
          </View>
        </View>

        {showStatus && item.status === 'approved' && (
          <TouchableOpacity 
            style={styles.claimButton} 
            onPress={handleClaim}
          >
            <Text style={styles.claimButtonText}>Claim</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  /* Grid Styles */
  gridCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
    width: '100%',
  },
  gridImageWrapper: {
    height: 140,
    width: '100%',
    backgroundColor: '#F8FAFC',
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  gridGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
  },
  gridStatusPill: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  gridStatusText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  gridContent: {
    padding: 12,
  },
  gridCategory: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  gridName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  gridFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gridMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  gridMetaText: {
    fontSize: 11,
    color: '#64748B',
    marginLeft: 4,
    fontWeight: '500',
  },
  gridDate: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },

  /* List Styles */
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginBottom: 12,
    padding: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    overflow: 'hidden',
  },
  listImage: {
    width: '100%',
    height: '100%',
  },
  listPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F9FF',
  },
  placeholderLogo: { width: 40, height: 40 },
  placeholderLogoSmall: { width: 24, height: 24 },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  listCategory: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0EA5E9',
    textTransform: 'uppercase',
  },
  listDate: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '500',
  },
  listName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  listMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listMetaText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },
  claimButton: {
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginLeft: 8,
  },
  claimButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
});

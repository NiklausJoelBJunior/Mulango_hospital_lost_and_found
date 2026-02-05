import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  StatusBar,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import ItemCard from '../components/ItemCard';
import SearchCardSkeleton from '../components/SearchCardSkeleton';

const { width } = Dimensions.get('window');

import Config from '../config';

export default function SearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('recent'); // recent, location, category

  // State for items must be declared before useMemo that depends on it
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);

  const categories = useMemo(() => {
    const base = [
      { key: 'All', icon: 'grid-outline' },
      { key: 'Electronics', icon: 'phone-portrait-outline' },
      { key: 'Personal', icon: 'briefcase-outline' },
      { key: 'Accessories', icon: 'glasses-outline' },
      { key: 'Documents', icon: 'document-text-outline' },
      { key: 'Clothing', icon: 'shirt-outline' },
      { key: 'Medical', icon: 'medical-outline' },
    ];
    const safeItems = Array.isArray(items) ? items : [];
    return base.map(cat => ({
      ...cat,
      count: cat.key === 'All' 
        ? safeItems.length 
        : safeItems.filter(i => (i.category || '').toLowerCase().includes(cat.key.toLowerCase())).length
    }));
  }, [items]);

  const API_BASE = Config.API_BASE;

  useEffect(() => {
    let mounted = true;
    const fetchItems = async () => {
      setLoadingItems(true);
      try {
        const res = await fetch(`${API_BASE}/items`);
        if (!res.ok) throw new Error('Failed to fetch items');
        const data = await res.json();
        if (mounted && Array.isArray(data)) setItems(data.filter(i => i.status === 'approved'));
      } catch (err) {
        console.warn('SearchScreen: could not load items', err);
      } finally {
        if (mounted) setLoadingItems(false);
      }
    };
    fetchItems();
    return () => { mounted = false; };
  }, []);

  const filteredItems = useMemo(() => {
    const src = Array.isArray(items) ? [...items] : []; // Create a copy immediately
    let filtered = src.filter(item => {
      const name = (item.name || '').toString().toLowerCase();
      const desc = (item.description || '').toString().toLowerCase();
      const loc = (item.location || '').toString().toLowerCase();
      const query = searchQuery.toLowerCase();
      
      const matchesSearch = name.includes(query) || desc.includes(query) || loc.includes(query);
      const matchesCategory = selectedCategory === 'All' || 
        (item.category || '').toLowerCase().includes(selectedCategory.toLowerCase());
      return matchesSearch && matchesCategory;
    });

    // Sort items (on a copy to avoid mutation issues)
    const sorted = [...filtered];
    switch (sortBy) {
      case 'recent':
        sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'location':
        sorted.sort((a, b) => (a.location || '').localeCompare(b.location || ''));
        break;
      case 'category':
        sorted.sort((a, b) => (a.category || '').localeCompare(b.category || ''));
        break;
    }

    return sorted;
  }, [items, searchQuery, selectedCategory, sortBy]);

  // Group items by section header when sorting by location or type
  const groupedItems = useMemo(() => {
    if (sortBy === 'recent') return null; // No grouping for recent
    const groups = [];
    let currentGroup = null;
    filteredItems.forEach((item) => {
      const key = sortBy === 'location' 
        ? (item.location || 'Unknown Location') 
        : (item.category || 'Uncategorized');
      if (!currentGroup || currentGroup.title !== key) {
        currentGroup = { title: key, items: [] };
        groups.push(currentGroup);
      }
      currentGroup.items.push(item);
    });
    return groups;
  }, [filteredItems, sortBy]);

  const getSortLabel = () => {
    switch (sortBy) {
      case 'location': return 'by Location (A-Z)';
      case 'category': return 'by Type (A-Z)';
      default: return 'by Most Recent';
    }
  };

  const getCategoryIcon = (category) => {
    const categoryObj = categories.find(cat => cat.key === category);
    return categoryObj ? categoryObj.icon : 'help-outline';
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return '#10B981';
      case 'pending': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Items</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search items, locations, descriptions..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Sort Pills - Always Visible */}
      <View style={styles.sortBar}>
        <Text style={styles.sortBarLabel}>Sort:</Text>
        {[
          { key: 'recent', label: 'Recent', icon: 'time-outline' },
          { key: 'location', label: 'Location', icon: 'location-outline' },
          { key: 'category', label: 'Type', icon: 'grid-outline' }
        ].map((option) => (
          <TouchableOpacity
            key={option.key}
            activeOpacity={0.7}
            style={[
              styles.sortPill,
              sortBy === option.key && styles.sortPillActive
            ]}
            onPress={() => setSortBy(option.key)}
          >
            <Ionicons 
              name={option.icon} 
              size={14} 
              color={sortBy === option.key ? '#fff' : '#64748B'} 
            />
            <Text style={[
              styles.sortPillText,
              sortBy === option.key && styles.sortPillTextActive
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.key}
            style={[
              styles.categoryChip,
              selectedCategory === category.key && styles.categoryChipActive
            ]}
            onPress={() => setSelectedCategory(category.key)}
          >
            <View style={styles.categoryIconContainer}>
              <Ionicons 
                name={category.icon} 
                size={14} 
                color={selectedCategory === category.key ? '#fff' : '#0EA5E9'} 
              />
            </View>
            <Text style={[
              styles.categoryText,
              selectedCategory === category.key && styles.categoryTextActive
            ]}>
              {category.key}
            </Text>
            <View style={[
              styles.categoryCount,
              selectedCategory === category.key && styles.categoryCountActive
            ]}>
              <Text style={[
                styles.categoryCountText,
                selectedCategory === category.key && styles.categoryCountTextActive
              ]}>
                {category.count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found
        </Text>
        <Text style={styles.resultsSubtitle}>
          Sorted {getSortLabel()}
          {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
          {searchQuery ? ` matching "${searchQuery}"` : ''}
        </Text>
      </View>

      <ScrollView 
        style={styles.resultsContainer} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.resultsContent}
      >
        {loadingItems ? (
          <View style={styles.gridContainer}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <View key={i} style={styles.gridItem}>
                <SearchCardSkeleton />
              </View>
            ))}
          </View>
        ) : groupedItems ? (
          /* Grouped view for Location / Type sorting */
          groupedItems.map((group) => (
            <View key={group.title}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons 
                  name={sortBy === 'location' ? 'location' : 'pricetag'} 
                  size={14} 
                  color="#0EA5E9" 
                />
                <Text style={styles.sectionHeaderText}>{group.title}</Text>
                <View style={styles.sectionHeaderCount}>
                  <Text style={styles.sectionHeaderCountText}>{group.items.length}</Text>
                </View>
                <View style={styles.sectionHeaderLine} />
              </View>
              <View style={styles.gridContainer}>
                {group.items.map((item) => (
                  <View key={item._id || item.id} style={styles.gridItem}>
                    <ItemCard 
                      item={item} 
                      navigation={navigation} 
                      isGrid={true} 
                      showStatus={false} 
                    />
                  </View>
                ))}
              </View>
            </View>
          ))
        ) : (
          /* Flat grid for Recent sorting */
          <View style={styles.gridContainer}>
            {filteredItems.map((item) => (
              <View key={item._id || item.id} style={styles.gridItem}>
                <ItemCard 
                  item={item} 
                  navigation={navigation} 
                  isGrid={true} 
                  showStatus={false} 
                />
              </View>
            ))}
          </View>
        )}

        {!loadingItems && filteredItems.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={80} color="#E5E7EB" />
            <Text style={styles.emptyTitle}>No items found</Text>
            <Text style={styles.emptyText}>
              {searchQuery || selectedCategory !== 'All' 
                ? "Try adjusting your search terms or filters"
                : "No lost items have been reported yet"
              }
            </Text>
            {(searchQuery || selectedCategory !== 'All') && (
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
              >
                <Text style={styles.resetButtonText}>Reset Search</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#F8FAFC',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },

  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  sortBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    gap: 8,
  },
  sortBarLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
    marginRight: 2,
  },
  sortPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 5,
  },
  sortPillActive: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  sortPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  sortPillTextActive: {
    color: '#fff',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 6,
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  sectionHeaderCount: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: 8,
  },
  sectionHeaderCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  sectionHeaderLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
    marginLeft: 8,
  },
  categoriesContainer: {
    paddingVertical: 4,
    flexGrow: 0,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    height: 36,
  },
  categoryChipActive: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
  },
  categoryIconContainer: {
    marginRight: 6,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginRight: 6,
  },
  categoryTextActive: {
    color: '#fff',
  },
  categoryCount: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  categoryCountActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  categoryCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  categoryCountTextActive: {
    color: '#fff',
  },
  resultsHeader: {
    paddingHorizontal: 20,
    paddingTop: 8,
    marginBottom: 0,
  },
  resultsCount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  resultsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  resultsContainer: {
    flex: 1,
  },
  resultsContent: {
    paddingHorizontal: 0, // Changed to 0 as gridContainer handles padding
    paddingBottom: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingTop: 16,
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48.5%', // Slightly less than 50% to allow for gap/spacing
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  urgencyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  itemCategory: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
  },
  claimButton: {
    backgroundColor: '#0EA5E9',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
  },
  claimButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  itemDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemLocationText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  itemDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemDateText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  resetButton: {
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
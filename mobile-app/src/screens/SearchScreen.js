import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function SearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('recent'); // recent, location, category
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { key: 'All', icon: 'grid-outline', count: 28 },
    { key: 'Electronics', icon: 'phone-portrait-outline', count: 8 },
    { key: 'Personal', icon: 'briefcase-outline', count: 12 },
    { key: 'Accessories', icon: 'glasses-outline', count: 5 },
    { key: 'Documents', icon: 'document-text-outline', count: 3 },
    { key: 'Clothing', icon: 'shirt-outline', count: 7 },
    { key: 'Medical', icon: 'medical-outline', count: 4 },
  ];

  const items = [
    { 
      id: 1, 
      name: 'Black Leather Wallet', 
      category: 'Personal', 
      location: 'ER - Room 203', 
      date: '2 hours ago',
      status: 'verified',
      description: 'Contains ID cards and credit cards',
      urgency: 'high'
    },
    { 
      id: 2, 
      name: 'iPhone 13 Pro', 
      category: 'Electronics', 
      location: 'Main Waiting Area', 
      date: '5 hours ago',
      status: 'verified',
      description: 'Black case with floral pattern',
      urgency: 'high'
    },
    { 
      id: 3, 
      name: 'Reading Glasses', 
      category: 'Accessories', 
      location: 'Pharmacy Counter', 
      date: '1 day ago',
      status: 'verified',
      description: 'Gold frame with +2.5 prescription',
      urgency: 'medium'
    },
    { 
      id: 4, 
      name: 'Car Keys with Blue Keychain', 
      category: 'Personal', 
      location: 'Parking Lot B - Level 2', 
      date: '1 day ago',
      status: 'pending',
      description: 'Toyota key fob with blue leather keychain',
      urgency: 'high'
    },
    { 
      id: 5, 
      name: 'Medical Records Folder', 
      category: 'Documents', 
      location: 'Administration Office', 
      date: '2 days ago',
      status: 'verified',
      description: 'Brown folder with patient documents',
      urgency: 'high'
    },
    { 
      id: 6, 
      name: 'Apple Watch Series 8', 
      category: 'Electronics', 
      location: 'Cafeteria - Table 12', 
      date: '3 days ago',
      status: 'verified',
      description: 'Silver aluminum case with white band',
      urgency: 'medium'
    },
    { 
      id: 7, 
      name: 'Brown Leather Messenger Bag', 
      category: 'Personal', 
      location: 'Main Entrance Security', 
      date: '3 days ago',
      status: 'pending',
      description: 'Contains laptop and notebooks',
      urgency: 'medium'
    },
    { 
      id: 8, 
      name: 'Gold Wedding Band', 
      category: 'Accessories', 
      location: 'ICU Floor 3 - Nurse Station', 
      date: '4 days ago',
      status: 'verified',
      description: '18k gold band, size 7',
      urgency: 'high'
    },
  ];

  const filteredItems = useMemo(() => {
    let filtered = items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort items
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'location':
        filtered.sort((a, b) => a.location.localeCompare(b.location));
        break;
      case 'category':
        filtered.sort((a, b) => a.category.localeCompare(b.category));
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, sortBy]);

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
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons name="filter" size={20} color="#0EA5E9" />
        </TouchableOpacity>
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

      {/* Filter Panel */}
      {showFilters && (
        <Animated.View style={styles.filterPanel}>
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Sort By</Text>
            <View style={styles.sortOptions}>
              {[
                { key: 'recent', label: 'Most Recent', icon: 'time-outline' },
                { key: 'location', label: 'Location', icon: 'location-outline' },
                { key: 'category', label: 'Category', icon: 'grid-outline' }
              ].map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.sortOption,
                    sortBy === option.key && styles.sortOptionActive
                  ]}
                  onPress={() => setSortBy(option.key)}
                >
                  <Ionicons 
                    name={option.icon} 
                    size={16} 
                    color={sortBy === option.key ? '#fff' : '#6B7280'} 
                  />
                  <Text style={[
                    styles.sortOptionText,
                    sortBy === option.key && styles.sortOptionTextActive
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animated.View>
      )}

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

      {/* Results */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found
        </Text>
        <Text style={styles.resultsSubtitle}>
          {selectedCategory !== 'All' && `in ${selectedCategory}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </Text>
      </View>

      <ScrollView 
        style={styles.resultsContainer} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.resultsContent}
      >
        {filteredItems.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.itemCard}
            onPress={() => navigation.navigate('ItemDetail', { item })}
          >
            <View style={styles.itemHeader}>
              <View style={styles.itemIconContainer}>
                <Ionicons 
                  name={getCategoryIcon(item.category)} 
                  size={20} 
                  color="#0EA5E9" 
                />
              </View>
              <View style={styles.itemTitleContainer}>
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                <View style={styles.itemMeta}>
                  <View style={[styles.urgencyDot, { backgroundColor: getUrgencyColor(item.urgency) }]} />
                  <Text style={styles.itemCategory}>{item.category}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>{item.status}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={styles.claimButton}>
                <Ionicons name="checkmark-circle" size={18} color="#fff" />
                <Text style={styles.claimButtonText}>Claim</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.itemDescription} numberOfLines={2}>
              {item.description}
            </Text>

            <View style={styles.itemFooter}>
              <View style={styles.itemLocation}>
                <Ionicons name="location" size={14} color="#6B7280" />
                <Text style={styles.itemLocationText}> {item.location}</Text>
              </View>
              <View style={styles.itemDate}>
                <Ionicons name="time" size={14} color="#6B7280" />
                <Text style={styles.itemDateText}> {item.date}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {filteredItems.length === 0 && (
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
  filterButton: {
    padding: 8,
    marginRight: -8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
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
  filterPanel: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  filterSection: {
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  sortOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  sortOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
    height: 3,
  },
  sortOptionActive: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
  },
  sortOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  sortOptionTextActive: {
    color: '#fff',
  },
  categoriesContainer: {
    // marginBottom: 16,
    height: 0,
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
    paddingVertical: 10,
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
    marginBottom: 16,
    
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
    paddingHorizontal: 20,
    paddingBottom: 20,
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
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Electronics', 'Personal', 'Accessories', 'Documents'];

  const items = [
    { id: 1, name: 'Black Wallet', category: 'Personal', location: 'ER - Room 203', date: '2 hours ago' },
    { id: 2, name: 'iPhone 13', category: 'Electronics', location: 'Waiting Area', date: '5 hours ago' },
    { id: 3, name: 'Reading Glasses', category: 'Accessories', location: 'Pharmacy', date: '1 day ago' },
    { id: 4, name: 'Keys with Blue Keychain', category: 'Personal', location: 'Parking Lot B', date: '1 day ago' },
    { id: 5, name: 'Medical Records Folder', category: 'Documents', location: 'Admin Office', date: '2 days ago' },
    { id: 6, name: 'Apple Watch', category: 'Electronics', location: 'Cafeteria', date: '3 days ago' },
    { id: 7, name: 'Brown Leather Bag', category: 'Personal', location: 'Main Entrance', date: '3 days ago' },
    { id: 8, name: 'Gold Ring', category: 'Accessories', location: 'ICU Floor 3', date: '4 days ago' },
  ];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for items..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.categoryChipActive
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.categoryTextActive
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results */}
      <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.resultsCount}>
          {filteredItems.length} items found
        </Text>

        {filteredItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.itemCard}>
            <View style={styles.itemIconContainer}>
              <MaterialIcons name="inventory-2" size={24} color="#0e7490" />
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.categoryBadge}>{item.category}</Text>
              <View style={styles.itemRow}>
                <Ionicons name="location" size={13} color="#666" />
                <Text style={styles.itemLocation}> {item.location}</Text>
              </View>
              <View style={styles.itemRow}>
                <Ionicons name="time" size={12} color="#999" />
                <Text style={styles.itemDate}> {item.date}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.claimButton}>
              <Ionicons name="checkmark-circle" size={18} color="#fff" />
              <Text style={styles.claimButtonText}> Claim</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        {filteredItems.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color="#ccc" style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>No items found</Text>
            <Text style={styles.emptyText}>
              Try adjusting your search or filters
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 60,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryChip: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryChipActive: {
    backgroundColor: '#0e7490',
    borderColor: '#0e7490',
  },
  categoryText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#fff',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultsCount: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    fontWeight: '600',
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0f2f7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  categoryBadge: {
    fontSize: 11,
    color: '#0e7490',
    backgroundColor: '#e0f2f7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 6,
    fontWeight: '600',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  itemLocation: {
    fontSize: 13,
    color: '#666',
  },
  itemDate: {
    fontSize: 12,
    color: '#999',
  },
  claimButton: {
    backgroundColor: '#0e7490',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  claimButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

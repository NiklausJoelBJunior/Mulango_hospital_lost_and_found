import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';

export default function ReportLostScreen({ navigation }) {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = ['Electronics', 'Personal Items', 'Accessories', 'Documents', 'Other'];

  const handleSubmit = () => {
    if (!itemName || !selectedCategory || !location) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    Alert.alert(
      'Report Submitted',
      'Your lost item report has been submitted successfully. We will notify you if we find a match.',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerIcon}>📋</Text>
          <Text style={styles.title}>Report Lost Item</Text>
          <Text style={styles.subtitle}>
            Fill in the details of your lost item to help us find it
          </Text>
        </View>

        <View style={styles.form}>
          {/* Item Name */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Item Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Black Wallet, iPhone 13"
              value={itemName}
              onChangeText={setItemName}
              placeholderTextColor="#999"
            />
          </View>

          {/* Category */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Category *</Text>
            <View style={styles.categoryGrid}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.categoryButtonActive
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    selectedCategory === category && styles.categoryButtonTextActive
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your item in detail (color, brand, distinctive features)"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              placeholderTextColor="#999"
            />
          </View>

          {/* Location */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Last Seen Location *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., ER, Waiting Area, Parking Lot B"
              value={location}
              onChangeText={setLocation}
              placeholderTextColor="#999"
            />
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>💡</Text>
            <Text style={styles.infoText}>
              Provide as much detail as possible to increase the chances of finding your item
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Report</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: '#0e7490',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
  },
  form: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryButtonActive: {
    backgroundColor: '#0e7490',
    borderColor: '#0e7490',
  },
  categoryButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  infoBox: {
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#856404',
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: '#0e7490',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 12,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});

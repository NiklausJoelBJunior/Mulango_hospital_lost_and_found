import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import Config from '../config';

export default function PostItemScreen({ navigation }) {
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    yourName: '',
    contact: '',
    category: '',
    location: '',
  });
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    'Electronics',
    'Personal Items',
    'Accessories',
    'Documents',
    'Clothing',
    'Medical',
    'Jewelry',
    'Other'
  ];

  const locations = [
    'Emergency Room',
    'Waiting Area',
    'Pharmacy',
    'Parking Lot',
    'Cafeteria',
    'Administration',
    'ICU',
    'Radiology',
    'Laboratory',
    'Other'
  ];

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert(
        'Permission Required', 
        'Permission to access camera roll is required to upload photos.',
        [{ text: 'OK' }]
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      exif: false,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert(
        'Permission Required', 
        'Camera access is required to take photos.',
        [{ text: 'OK' }]
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      exif: false,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.yourName.trim()) {
      newErrors.yourName = 'Your name is required';
    }

    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact information is required';
    } else {
      const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (!phoneRegex.test(formData.contact.replace(/\s/g, '')) && !emailRegex.test(formData.contact)) {
        newErrors.contact = 'Please enter a valid phone number or email';
      }
    }

    if (!formData.itemName.trim()) {
      newErrors.itemName = 'Item name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.location) {
      newErrors.location = 'Please select where the item was found';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Missing Information', 'Please fill in all required fields correctly.');
      return;
    }

    setIsSubmitting(true);

    // Real API call to backend
    const API_BASE = Config.API_BASE;

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('name', formData.itemName);
    formDataToSubmit.append('itemName', formData.itemName);
    formDataToSubmit.append('description', formData.description);
    formDataToSubmit.append('category', formData.category);
    formDataToSubmit.append('location', formData.location);
    formDataToSubmit.append('yourName', formData.yourName);
    formDataToSubmit.append('reporterName', formData.yourName);
    formDataToSubmit.append('contact', formData.contact);
    formDataToSubmit.append('reporterContact', formData.contact);

    if (image) {
      const uriParts = image.split('.');
      const fileType = uriParts[uriParts.length - 1];
      formDataToSubmit.append('image', {
        uri: image,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      });
    }

    try {
      const res = await fetch(`${API_BASE}/items`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: formDataToSubmit,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Server responded with ${res.status}`);
      }

      const created = await res.json();

      Alert.alert(
        'Item Posted Successfully!',
        'Your found item has been saved. We will notify the owner when matched.',
        [
          { text: 'OK', onPress: () => navigation.navigate('Main') },
          { text: 'Post Another', onPress: resetForm, style: 'default' },
        ]
      );
    } catch (error) {
      console.error('Submit error', error);
      Alert.alert('Submission Failed', "Couldn't submit the item. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      itemName: '',
      description: '',
      yourName: '',
      contact: '',
      category: '',
      location: '',
    });
    setImage(null);
    setErrors({});
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Electronics': 'phone-portrait-outline',
      'Personal Items': 'briefcase-outline',
      'Accessories': 'glasses-outline',
      'Documents': 'document-text-outline',
      'Clothing': 'shirt-outline',
      'Medical': 'medical-outline',
      'Jewelry': 'diamond-outline',
      'Other': 'cube-outline'
    };
    return icons[category] || 'help-outline';
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerBackground} />
          <View style={styles.headerContent}>
            <View style={styles.headerIconContainer}>
              <MaterialIcons name="add-photo-alternate" size={32} color="#0EA5E9" />
            </View>
            <Text style={styles.title}>Report Found Item</Text>
            <Text style={styles.subtitle}>
              Help reunite lost items with their owners
            </Text>
          </View>
        </View>

        <View style={styles.form}>
          {/* Contact Information Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="person-outline" size={20} color="#0EA5E9" />
              <Text style={styles.sectionTitle}>Your Information</Text>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Your Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.yourName && styles.inputError]}
                placeholder="Enter your full name"
                value={formData.yourName}
                onChangeText={(text) => updateFormData('yourName', text)}
                placeholderTextColor="#9CA3AF"
              />
              {errors.yourName && <Text style={styles.errorText}>{errors.yourName}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Contact Information <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.contact && styles.inputError]}
                placeholder="Phone number or email address"
                value={formData.contact}
                onChangeText={(text) => updateFormData('contact', text)}
                placeholderTextColor="#9CA3AF"
                keyboardType="default"
                autoCapitalize="none"
              />
              {errors.contact && <Text style={styles.errorText}>{errors.contact}</Text>}
              <Text style={styles.hint}>
                We'll use this to contact you when the owner is found
              </Text>
            </View>
          </View>

          {/* Item Details Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="cube-outline" size={20} color="#0EA5E9" />
              <Text style={styles.sectionTitle}>Item Details</Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Item Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.itemName && styles.inputError]}
                placeholder="e.g., Black Leather Wallet, iPhone 13 Pro"
                value={formData.itemName}
                onChangeText={(text) => updateFormData('itemName', text)}
                placeholderTextColor="#9CA3AF"
              />
              {errors.itemName && <Text style={styles.errorText}>{errors.itemName}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Category <Text style={styles.required}>*</Text></Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesContainer}
                contentContainerStyle={styles.categoriesContent}
              >
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryChip,
                      formData.category === category && styles.categoryChipActive
                    ]}
                    onPress={() => updateFormData('category', category)}
                  >
                    <Ionicons 
                      name={getCategoryIcon(category)} 
                      size={16} 
                      color={formData.category === category ? '#fff' : '#0EA5E9'} 
                    />
                    <Text style={[
                      styles.categoryText,
                      formData.category === category && styles.categoryTextActive
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Found Location <Text style={styles.required}>*</Text></Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesContainer}
                contentContainerStyle={styles.categoriesContent}
              >
                {locations.map((location) => (
                  <TouchableOpacity
                    key={location}
                    style={[
                      styles.categoryChip,
                      formData.location === location && styles.categoryChipActive
                    ]}
                    onPress={() => updateFormData('location', location)}
                  >
                    <Ionicons 
                      name="location-outline" 
                      size={16} 
                      color={formData.location === location ? '#fff' : '#0EA5E9'} 
                    />
                    <Text style={[
                      styles.categoryText,
                      formData.location === location && styles.categoryTextActive
                    ]}>
                      {location}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe the item in detail (color, brand, distinctive features, condition, contents if any)"
                value={formData.description}
                onChangeText={(text) => updateFormData('description', text)}
                multiline
                numberOfLines={4}
                placeholderTextColor="#9CA3AF"
                textAlignVertical="top"
              />
              <Text style={styles.hint}>
                Detailed descriptions help owners identify their items more accurately
              </Text>
            </View>
          </View>

          {/* Image Upload Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="camera-outline" size={20} color="#0EA5E9" />
              <Text style={styles.sectionTitle}>Item Photos</Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Add Photos (Optional)</Text>
              {image ? (
                <View style={styles.imageContainer}>
                  <Image source={{ uri: image }} style={styles.image} />
                  <TouchableOpacity 
                    style={styles.removeImageButton}
                    onPress={() => setImage(null)}
                  >
                    <Ionicons name="close" size={18} color="#fff" />
                  </TouchableOpacity>
                  <View style={styles.imageOverlay}>
                    <Text style={styles.imageOverlayText}>Tap to change</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.imageButtons}>
                  <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
                    <View style={styles.imageButtonIcon}>
                      <Ionicons name="camera" size={28} color="#0EA5E9" />
                    </View>
                    <Text style={styles.imageButtonText}>Take Photo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                    <View style={styles.imageButtonIcon}>
                      <Ionicons name="images" size={28} color="#0EA5E9" />
                    </View>
                    <Text style={styles.imageButtonText}>Choose from Gallery</Text>
                  </TouchableOpacity>
                </View>
              )}
              <Text style={styles.hint}>
                Clear photos significantly increase the chances of item recovery
              </Text>
            </View>
          </View>

          {/* Information Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Ionicons name="shield-checkmark" size={20} color="#10B981" />
              <Text style={styles.infoTitle}>Secure & Verified Process</Text>
            </View>
            <View style={styles.infoContent}>
              <View style={styles.infoItem}>
                <Ionicons name="time-outline" size={16} color="#6B7280" />
                <Text style={styles.infoText}>Items are reviewed within 24 hours</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="eye-off-outline" size={16} color="#6B7280" />
                <Text style={styles.infoText}>Your contact info is kept private</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="checkmark-done-outline" size={16} color="#6B7280" />
                <Text style={styles.infoText}>You'll be notified when item is claimed</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity 
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color="#fff" />
                  <Text style={styles.submitButtonText}>Submit Found Item</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    position: 'relative',
    paddingTop: 60,
    paddingBottom: 30,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0EA5E9',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  headerIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#E0F2FE',
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    padding: 24,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginTop: 6,
  },
  hint: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 6,
    lineHeight: 18,
  },
  categoriesContainer: {
    marginHorizontal: -4,
  },
  categoriesContent: {
    paddingHorizontal: 4,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryTextActive: {
    color: '#fff',
  },
  imageButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  imageButton: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    gap: 12,
  },
  imageButtonIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  imageContainer: {
    position: 'relative',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  image: {
    width: '100%',
    height: 200,
  },
  removeImageButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 12,
  },
  imageOverlayText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#166534',
  },
  infoContent: {
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  actions: {
    gap: 12,
  },
  submitButton: {
    backgroundColor: '#0EA5E9',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
});
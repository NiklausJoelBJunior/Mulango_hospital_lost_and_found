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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function PostItemScreen({ navigation }) {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [yourName, setYourName] = useState('');
  const [contact, setContact] = useState('');
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!itemName || !yourName || !contact) {
      Alert.alert('Missing Information', 'Please fill in all required fields: Item Name, Your Name, and Contact.');
      return;
    }

    // Validate contact (basic phone/email check)
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!phoneRegex.test(contact) && !emailRegex.test(contact)) {
      Alert.alert('Invalid Contact', 'Please enter a valid phone number or email address.');
      return;
    }

    Alert.alert(
      'Item Posted Successfully',
      'Your lost item has been posted. It will be visible to others once verified by an admin.',
      [
        {
          text: 'OK',
          onPress: () => {
            // Clear form
            setItemName('');
            setDescription('');
            setYourName('');
            setContact('');
            setImage(null);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <MaterialIcons name="inventory-2" size={48} color="#fff" style={styles.headerIcon} />
          <Text style={styles.title}>Post Lost Item</Text>
          <Text style={styles.subtitle}>
            Help others find this item by providing details
          </Text>
        </View>

        <View style={styles.form}>
          {/* Your Name */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Your Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., John Doe"
              value={yourName}
              onChangeText={setYourName}
              placeholderTextColor="#999"
            />
          </View>

          {/* Contact */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Contact (Phone or Email) *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., +1234567890 or email@example.com"
              value={contact}
              onChangeText={setContact}
              placeholderTextColor="#999"
              keyboardType="default"
              autoCapitalize="none"
            />
            <Text style={styles.hint}>We'll use this to contact you if someone claims the item</Text>
          </View>

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

          {/* Description */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe the item in detail (color, brand, distinctive features, where it was found)"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              placeholderTextColor="#999"
            />
          </View>

          {/* Image Upload */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Item Photo (Optional)</Text>
            {image ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.image} />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => setImage(null)}
                >
                  <Ionicons name="close" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.imageButtons}>
                <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
                  <Ionicons name="camera" size={32} color="#0e7490" />
                  <Text style={styles.imageButtonText}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                  <Ionicons name="images" size={32} color="#0e7490" />
                  <Text style={styles.imageButtonText}>Choose from Gallery</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={24} color="#0e7490" style={styles.infoIcon} />
            <Text style={styles.infoText}>
              Your post will be reviewed by an admin before it becomes visible to others. This helps maintain quality and prevents spam.
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Item</Text>
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
    marginBottom: 20,
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
  hint: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
  },
  imageButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  imageButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0e7490',
    borderStyle: 'dashed',
    gap: 8,
  },
  imageButtonText: {
    fontSize: 14,
    color: '#0e7490',
    fontWeight: '600',
    textAlign: 'center',
  },
  imageContainer: {
    position: 'relative',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBox: {
    backgroundColor: '#e0f2f7',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#0e7490',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#0e7490',
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

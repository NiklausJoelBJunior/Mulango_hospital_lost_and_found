import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Config from '../config';

const UpdateHandler = () => {
  const [updateVisible, setUpdateVisible] = useState(false);
  const [latestVersion, setLatestVersion] = useState(null);

  useEffect(() => {
    checkUpdates();
  }, []);

  const checkUpdates = async () => {
    try {
      // Fetch latest release from GitHub API
      const response = await fetch(
        `https://api.github.com/repos/${Config.GITHUB_REPO}/releases/latest`,
        { headers: { 'Accept': 'application/vnd.github.v3+json' } }
      );
      
      const data = await response.json();
      
      if (data && data.tag_name) {
        setLatestVersion(data.tag_name);
        // If current version doesn't match latest release tag
        if (data.tag_name !== Config.APP_VERSION) {
          setUpdateVisible(true);
        }
      }
    } catch (err) {
      console.log('Update check failed:', err);
    }
  };

  const handleUpdate = () => {
    const apkUrl = `https://github.com/${Config.GITHUB_REPO}/releases/latest/download/mlaf.apk`;
    Linking.openURL(apkUrl);
    setUpdateVisible(false);
  };

  return (
    <Modal
      visible={updateVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setUpdateVisible(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.iconContainer}>
            <Ionicons name="cloud-download" size={50} color="#0e7490" />
          </View>
          
          <Text style={styles.title}>Update Available!</Text>
          <Text style={styles.description}>
            A new version ({latestVersion}) of MLAF is available. Update now to get the latest features and bug fixes.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.laterButton} 
              onPress={() => setUpdateVisible(false)}
            >
              <Text style={styles.laterText}>Later</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.updateButton} 
              onPress={handleUpdate}
            >
              <Text style={styles.updateText}>Update Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10
  },
  description: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 25
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12
  },
  laterButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center'
  },
  laterText: {
    color: '#64748b',
    fontWeight: '600'
  },
  updateButton: {
    flex: 1,
    backgroundColor: '#0e7490',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center'
  },
  updateText: {
    color: 'white',
    fontWeight: 'bold'
  }
});

export default UpdateHandler;

import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Updates from 'expo-updates';

const UpdateHandler = () => {
  const [updateState, setUpdateState] = useState('checking'); // checking, available, downloading, installing, ready, none, error
  const [updateVisible, setUpdateVisible] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkForUpdates();
  }, []);

  const checkForUpdates = async () => {
    try {
      // Skip update check in development mode
      if (__DEV__) {
        console.log('Skipping update check in development mode');
        setUpdateState('none');
        return;
      }

      setUpdateState('checking');
      const update = await Updates.checkForUpdateAsync();
      
      if (update.isAvailable) {
        setUpdateState('available');
        setUpdateVisible(true);
      } else {
        setUpdateState('none');
      }
    } catch (err) {
      console.log('Update check error:', err);
      setError(err.message);
      setUpdateState('error');
    }
  };

  const handleUpdate = async () => {
    try {
      setUpdateState('downloading');
      
      // Download the update
      const result = await Updates.fetchUpdateAsync();
      
      if (result.isNew) {
        setUpdateState('installing');
        setDownloadProgress(100);
        
        // Small delay to show the installing state
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setUpdateState('ready');
        
        // Auto-restart after a brief moment
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Reload the app with the new update
        await Updates.reloadAsync();
      } else {
        setUpdateState('none');
        setUpdateVisible(false);
      }
    } catch (err) {
      console.log('Update download error:', err);
      setError(err.message);
      setUpdateState('error');
    }
  };

  const handleLater = () => {
    setUpdateVisible(false);
    setUpdateState('none');
  };

  const handleRetry = () => {
    setError(null);
    checkForUpdates();
  };

  // Don't show anything if no update or checking silently
  if (!updateVisible && updateState !== 'downloading' && updateState !== 'installing' && updateState !== 'ready') {
    return null;
  }

  // Render update available modal
  if (updateState === 'available') {
    return (
      <Modal
        visible={updateVisible}
        transparent
        animationType="fade"
        onRequestClose={handleLater}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.iconContainer}>
              <Ionicons name="cloud-download" size={50} color="#0e7490" />
            </View>
            
            <Text style={styles.title}>Update Available!</Text>
            <Text style={styles.description}>
              A new version of MLAF is available. Update now to get the latest features and bug fixes.
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.laterButton} 
                onPress={handleLater}
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
  }

  // Render downloading/installing/ready screen (full screen overlay)
  if (updateState === 'downloading' || updateState === 'installing' || updateState === 'ready') {
    return (
      <Modal
        visible={true}
        transparent={false}
        animationType="fade"
      >
        <View style={styles.fullScreenOverlay}>
          <View style={styles.updateContainer}>
            {/* App Icon */}
            <View style={styles.appIconContainer}>
              <Ionicons name="medical" size={60} color="white" />
            </View>
            
            <Text style={styles.appName}>MLAF</Text>
            <Text style={styles.updateTitle}>
              {updateState === 'downloading' && 'Downloading Update...'}
              {updateState === 'installing' && 'Installing Update...'}
              {updateState === 'ready' && 'Update Complete!'}
            </Text>

            {/* Progress indicator */}
            {(updateState === 'downloading' || updateState === 'installing') && (
              <View style={styles.progressContainer}>
                <ActivityIndicator size="large" color="white" />
                <Text style={styles.progressText}>
                  {updateState === 'downloading' ? 'Downloading...' : 'Installing...'}
                </Text>
              </View>
            )}

            {updateState === 'ready' && (
              <View style={styles.successContainer}>
                <View style={styles.checkContainer}>
                  <Ionicons name="checkmark-circle" size={80} color="#4ade80" />
                </View>
                <Text style={styles.successText}>Restarting app...</Text>
              </View>
            )}

            <Text style={styles.warningText}>
              Please don't close the app
            </Text>
          </View>
        </View>
      </Modal>
    );
  }

  // Render error state
  if (updateState === 'error') {
    return (
      <Modal
        visible={updateVisible}
        transparent
        animationType="fade"
        onRequestClose={handleLater}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={[styles.iconContainer, { backgroundColor: '#fef2f2' }]}>
              <Ionicons name="alert-circle" size={50} color="#dc2626" />
            </View>
            
            <Text style={styles.title}>Update Failed</Text>
            <Text style={styles.description}>
              {error || 'Failed to download update. Please check your internet connection and try again.'}
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.laterButton} 
                onPress={handleLater}
              >
                <Text style={styles.laterText}>Skip</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.updateButton} 
                onPress={handleRetry}
              >
                <Text style={styles.updateText}>Retry</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  return null;
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
  },
  // Full screen update styles
  fullScreenOverlay: {
    flex: 1,
    backgroundColor: '#0e7490',
    justifyContent: 'center',
    alignItems: 'center'
  },
  updateContainer: {
    alignItems: 'center',
    padding: 40
  },
  appIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10
  },
  updateTitle: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 40
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 40
  },
  progressText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    marginTop: 15
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 40
  },
  checkContainer: {
    marginBottom: 10
  },
  successText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 18
  },
  warningText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14
  }
});

export default UpdateHandler;

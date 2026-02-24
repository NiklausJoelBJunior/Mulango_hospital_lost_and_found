import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../context/AuthContext';

import Config from '../config';

const { width, height } = Dimensions.get('window');

export default function AdminLoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTime, setLockTime] = useState(0);

  const { signIn } = useContext(AuthContext);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Security lockout timer
  useEffect(() => {
    if (isLocked && lockTime > 0) {
      const timer = setInterval(() => {
        setLockTime(prev => {
          if (prev <= 1) {
            setIsLocked(false);
            setLoginAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isLocked, lockTime]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const animateButtonPress = () => {
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const validateInputs = () => {
    if (!username.trim()) {
      Alert.alert('Username Required', 'Please enter your username');
      return false;
    }
    if (!password) {
      Alert.alert('Password Required', 'Please enter your password');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Password Too Short', 'Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (isLocked) {
      Alert.alert(
        'Account Locked',
        `Too many failed attempts. Please wait ${lockTime} seconds before trying again.`
      );
      return;
    }

    if (!validateInputs()) {
      shake();
      return;
    }

    animateButtonPress();
    setIsSubmitting(true);

    try {
      const API_BASE = Config.API_BASE;
      const response = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Version': '1.0.0',
        },
        body: JSON.stringify({ 
          username: username.trim(), 
          password 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const attempts = loginAttempts + 1;
        setLoginAttempts(attempts);

        if (attempts >= 3) {
          setIsLocked(true);
          setLockTime(30); // 30 second lockout
          Alert.alert(
            'Account Locked',
            'Too many failed attempts. Please wait 30 seconds before trying again.'
          );
        } else {
          shake();
          Alert.alert(
            'Login Failed',
            data.error || 'Invalid credentials. Please try again.',
            [
              { 
                text: 'OK', 
                style: 'default',
                onPress: () => {
                  if (attempts === 2) {
                    Alert.alert(
                      'Warning',
                      'One more failed attempt will temporarily lock your account.'
                    );
                  }
                }
              }
            ]
          );
        }
        return;
      }

      // Successful login
      setLoginAttempts(0);
      setIsLocked(false);

      // Sign in with context
      await signIn({ 
        token: data.token, 
        admin: data.admin,
        user: data.user 
      });

      // Success animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1.2,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -20,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        navigation.replace('AdminDashboard');
      });

    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert(
        'Connection Error',
        'Unable to connect to the server. Please check your network connection.'
      );
      shake();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmergencyAccess = () => {
    Alert.alert(
      'Emergency Access',
      'For emergency access, please use two-factor authentication or contact system administrator.',
      [
        { text: '2FA Login', onPress: () => navigation.navigate('TwoFactorLogin') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <AnimatedLinearGradient
        colors={['#FFFFFF', '#F8FAFC', '#F1F5F9']}
        style={[StyleSheet.absoluteFill, { opacity: fadeAnim }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Security Pattern Overlay */}
      <View style={styles.patternOverlay}>
        {Array.from({ length: 20 }).map((_, i) => (
          <View 
            key={i} 
            style={[
              styles.patternDot,
              {
                left: Math.random() * width,
                top: Math.random() * height,
                opacity: 0.05 + Math.random() * 0.05,
              }
            ]}
          />
        ))}
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View 
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { translateX: shakeAnim }
                ]
              }
            ]}
          >
            {/* Security Header */}
            <View style={styles.securityHeader}>
              <View style={styles.securityBadge}>
                <Feather name="shield" size={24} color="#0EA5E9" />
                <View style={styles.securityLevel}>
                  <View style={styles.levelBar} />
                  <View style={[styles.levelBar, { width: '66%' }]} />
                  <View style={[styles.levelBar, { width: '33%' }]} />
                </View>
              </View>
              <Text style={styles.securityText}>Secure Admin Portal</Text>
            </View>

            {/* Login Card */}
            <View style={styles.loginCard}>
              <LinearGradient
                colors={['rgba(255,255,255,0.98)', 'rgba(255,255,255,0.95)']}
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {/* Header */}
                <View style={styles.cardHeader}>
                  <View style={styles.iconContainer}>
                    <LinearGradient
                      colors={['#0EA5E9', '#0284C7']}
                      style={styles.iconGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <MaterialIcons name="admin-panel-settings" size={32} color="#fff" />
                    </LinearGradient>
                  </View>
                  <Text style={styles.title}>Administrator Login</Text>
                  <Text style={styles.subtitle}>
                    Access the secure management dashboard
                  </Text>
                </View>

                {/* Lockout Warning */}
                {isLocked && (
                  <View style={styles.lockoutAlert}>
                    <Feather name="lock" size={16} color="#EF4444" />
                    <Text style={styles.lockoutText}>
                      Account locked for {lockTime} seconds
                    </Text>
                  </View>
                )}

                {/* Login Attempts Indicator */}
                {loginAttempts > 0 && !isLocked && (
                  <View style={styles.attemptsIndicator}>
                    <Text style={styles.attemptsText}>
                      Attempts: {loginAttempts}/3
                    </Text>
                    <View style={styles.attemptsDots}>
                      {[1, 2, 3].map(i => (
                        <View 
                          key={i}
                          style={[
                            styles.attemptDot,
                            i <= loginAttempts && styles.attemptDotActive,
                            i === 3 && loginAttempts >= 2 && styles.attemptDotWarning
                          ]}
                        />
                      ))}
                    </View>
                  </View>
                )}

                {/* Form */}
                <View style={styles.form}>
                  {/* Username Input */}
                  <View style={styles.inputGroup}>
                    <View style={styles.inputLabelRow}>
                      <Ionicons name="person-outline" size={16} color="#64748B" />
                      <Text style={styles.label}>Admin Username</Text>
                      <Text style={styles.required}>*</Text>
                    </View>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your username"
                        placeholderTextColor="#94A3B8"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!isSubmitting && !isLocked}
                        selectionColor="#0EA5E9"
                      />
                      {username.length > 0 && (
                        <TouchableOpacity 
                          style={styles.clearButton}
                          onPress={() => setUsername('')}
                          disabled={isSubmitting}
                        >
                          <Ionicons name="close-circle" size={18} color="#94A3B8" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>

                  {/* Password Input */}
                  <View style={styles.inputGroup}>
                    <View style={styles.inputLabelRow}>
                      <Ionicons name="lock-closed-outline" size={16} color="#64748B" />
                      <Text style={styles.label}>Password</Text>
                      <Text style={styles.required}>*</Text>
                    </View>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={[styles.input, styles.passwordInput]}
                        placeholder="Enter your password"
                        placeholderTextColor="#94A3B8"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        editable={!isSubmitting && !isLocked}
                        selectionColor="#0EA5E9"
                      />
                      <TouchableOpacity 
                        style={styles.eyeButton}
                        onPress={() => setShowPassword(!showPassword)}
                        disabled={isSubmitting}
                      >
                        <Ionicons 
                          name={showPassword ? "eye-off-outline" : "eye-outline"} 
                          size={20} 
                          color={isSubmitting ? "#CBD5E1" : "#64748B"} 
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Login Button */}
                  <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                    <TouchableOpacity 
                      style={[
                        styles.loginButton,
                        (isSubmitting || isLocked) && styles.loginButtonDisabled
                      ]}
                      onPress={handleLogin}
                      disabled={isSubmitting || isLocked}
                      activeOpacity={0.9}
                    >
                      <LinearGradient
                        colors={isLocked ? ['#94A3B8', '#64748B'] : ['#0EA5E9', '#0284C7']}
                        style={styles.buttonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        {isSubmitting ? (
                          <View style={styles.buttonContent}>
                            <ActivityIndicator size="small" color="#fff" />
                            <Text style={styles.loginButtonText}>Authenticating...</Text>
                          </View>
                        ) : (
                          <View style={styles.buttonContent}>
                            <Feather name="log-in" size={20} color="#fff" />
                            <Text style={styles.loginButtonText}>
                              {isLocked ? 'Account Locked' : 'Login to Dashboard'}
                            </Text>
                          </View>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animated.View>

                  {/* Security Notice */}
                  <View style={styles.securityNotice}>
                    <Feather name="info" size={14} color="#64748B" />
                    <Text style={styles.securityNoticeText}>
                      This is a secure admin portal. All activities are logged and monitored.
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </View>

            {/* Bottom Actions */}
            <View style={styles.bottomActions}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                disabled={isSubmitting}
              >
                <Ionicons name="arrow-back" size={16} color="#64748B" />
                <Text style={styles.backButtonText}>Back to App</Text>
              </TouchableOpacity>

              
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                © {new Date().getFullYear()} Medical Lost & Found • v1.0.0
              </Text>
              <View style={styles.footerSecurity}>
                <Feather name="shield" size={12} color="#64748B" />
                <Text style={styles.footerSecurityText}>TLS 1.3 Encrypted</Text>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ScrollView component
const ScrollView = ({ children, ...props }) => (
  React.createElement(require('react-native').ScrollView, props, children)
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  patternOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  patternDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
  },
  content: {
    zIndex: 1,
    paddingHorizontal: 24,
  },
  securityHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  securityBadge: {
    alignItems: 'center',
    marginBottom: 12,
  },
  securityLevel: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    gap: 4,
  },
  levelBar: {
    width: '100%',
    height: 3,
    backgroundColor: '#E2E8F0',
    borderRadius: 1.5,
  },
  securityText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
    letterSpacing: 1,
  },
  loginCard: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
    marginBottom: 32,
  },
  cardGradient: {
    padding: 32,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    marginBottom: 20,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },
  lockoutAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 8,
  },
  lockoutText: {
    fontSize: 14,
    color: '#DC2626',
    fontWeight: '600',
  },
  attemptsIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  attemptsText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
  },
  attemptsDots: {
    flexDirection: 'row',
    gap: 6,
  },
  attemptDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
  },
  attemptDotActive: {
    backgroundColor: '#0EA5E9',
  },
  attemptDotWarning: {
    backgroundColor: '#EF4444',
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  required: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  passwordInput: {
    paddingRight: 50,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  eyeButton: {
    position: 'absolute',
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  loginButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    paddingVertical: 18,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loginButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  securityNoticeText: {
    flex: 1,
    fontSize: 13,
    color: '#0C4A6E',
    lineHeight: 18,
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  backButtonText: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '600',
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 6,
  },
  emergencyButtonText: {
    fontSize: 13,
    color: '#EF4444',
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    gap: 12,
  },
  footerText: {
    fontSize: 13,
    color: '#64748B',
  },
  footerSecurity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerSecurityText: {
    fontSize: 12,
    color: '#64748B',
    letterSpacing: 0.5,
  },
});
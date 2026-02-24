import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export default function ContactScreen({ navigation }) {
  const contactInfo = [
    {
      id: 1,
      title: 'Email Us',
      value: 'lafm46798@gmail.com',
      icon: 'mail-outline',
      action: () => Linking.openURL('mailto:lafm46798@gmail.com'),
      color: '#0EA5E9',
    },
    {
      id: 2,
      title: 'Call Us',
      value: '+256 773 285 064',
      icon: 'call-outline',
      action: () => Linking.openURL('tel:+256773285064'),
      color: '#10B981',
    },
    {
      id: 3,
      title: 'Visit Reception',
      value: 'Main Lobby, Level 1',
      icon: 'location-outline',
      action: null,
      color: '#8B5CF6',
    },
    {
      id: 4,
      title: 'Support Hours',
      value: '9am - 5pm Mon-Fri',
      icon: 'time-outline',
      action: null,
      color: '#F59E0B',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="face-agent" size={50} color="#0EA5E9" />
          </View>
          <Text style={styles.heroTitle}>How can we help?</Text>
          <Text style={styles.heroSubtitle}>
            Our dedicated team is here to help you find your lost belongings.
          </Text>
        </View>

        <View style={styles.infoGrid}>
          {contactInfo.map((info) => (
            <TouchableOpacity 
              key={info.id}
              style={styles.infoCard}
              onPress={info.action}
              disabled={!info.action}
              activeOpacity={info.action ? 0.7 : 1}
            >
              <View style={[styles.cardIconContainer, { backgroundColor: info.color + '15' }]}>
                <Ionicons name={info.icon} size={24} color={info.color} />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardLabel}>{info.title}</Text>
                <Text style={styles.cardValue}>{info.value}</Text>
              </View>
              {info.action && (
                <Feather name="external-link" size={16} color="#94A3B8" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.noticeBox}>
          <Ionicons name="shield-checkmark" size={20} color="#0EA5E9" />
          <Text style={styles.noticeText}>
            For security reasons, please do not send sensitive personal identification through email.
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.footerButton}
        onPress={() => Linking.openURL('mailto:lafm46798@gmail.com')}
      >
        <Text style={styles.footerButtonText}>Send Message</Text>
      </TouchableOpacity>
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
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  infoGrid: {
    gap: 16,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '700',
  },
  noticeBox: {
    marginTop: 40,
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    color: '#0369A1',
    fontWeight: '500',
    lineHeight: 18,
  },
  footerButton: {
    position: 'absolute',
    bottom: 30,
    left: 24,
    right: 24,
    height: 56,
    backgroundColor: '#0EA5E9',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  footerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  LayoutAnimation,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FAQ_DATA = [
  {
    question: "How do I report a found item?",
    answer: "You can report a found item by clicking the 'Post Item' button on the home screen. Fill in the details, upload a photo, and our team will verify the report."
  },
  {
    question: "How can I claim an item?",
    answer: "If you recognize an item, click on it to see the details. If it's verified (Approved), click 'Claim this Item', fill in your details, and proceed to the hospital reception desk."
  },
  {
    question: "Where is the Hospital Reception?",
    answer: "The main reception desk is located in the Main Lobby on Level 1, near the pharmacy. It is open 24/7 for lost and found assistance."
  },
  {
    question: "What documents do I need to collect an item?",
    answer: "You must provide a valid government-issued ID (Passport, Driver's License, or Employee ID) and be able to describe the item in detail or provide proof of ownership."
  },
  {
    question: "How long are items kept?",
    answer: "Found items are kept for up to 90 days. Unclaimed items are either donated to local charities or disposed of according to hospital policy."
  }
];

const FAQItem = ({ question, answer }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <TouchableOpacity 
      style={[styles.faqCard, expanded && styles.faqCardExpanded]} 
      onPress={toggleExpand}
      activeOpacity={0.7}
    >
      <View style={styles.faqHeader}>
        <Text style={styles.question}>{question}</Text>
        <Ionicons 
          name={expanded ? "chevron-up" : "chevron-down"} 
          size={20} 
          color={expanded ? "#0EA5E9" : "#64748B"} 
        />
      </View>
      {expanded && (
        <View style={styles.faqBody}>
          <View style={styles.divider} />
          <Text style={styles.answer}>{answer}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function FAQScreen({ navigation }) {
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
        <Text style={styles.headerTitle}>Frequently Asked Questions</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionSubtitle}>
          Everything you need to know about our Lost & Found process.
        </Text>

        <View style={styles.faqList}>
          {FAQ_DATA.map((item, index) => (
            <FAQItem key={index} question={item.question} answer={item.answer} />
          ))}
        </View>

        <View style={styles.contactPrompt}>
          <Text style={styles.promptTitle}>Still have questions?</Text>
          <Text style={styles.promptText}>
            Can't find the answer you're looking for? Please contact our support team.
          </Text>
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={() => navigation.navigate('Contact')}
          >
            <Text style={styles.contactButtonText}>Get in Touch</Text>
          </TouchableOpacity>
        </View>
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
    paddingBottom: 40,
  },
  sectionSubtitle: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 32,
    lineHeight: 22,
  },
  faqList: {
    gap: 16,
  },
  faqCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  faqCardExpanded: {
    borderColor: '#BAE6FD',
    backgroundColor: '#F0F9FF',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  question: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    paddingRight: 10,
  },
  faqBody: {
    marginTop: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginBottom: 16,
  },
  answer: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  contactPrompt: {
    marginTop: 48,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  promptTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  promptText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  contactButton: {
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});

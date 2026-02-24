import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

export default function MyReportsScreen() {
  const reports = [
    { id: 1, name: 'Black Wallet', status: 'Searching', date: 'Nov 10, 2025', matches: 0 },
    { id: 2, name: 'Reading Glasses', status: 'Match Found', date: 'Nov 8, 2025', matches: 1 },
    { id: 3, name: 'Car Keys', status: 'Claimed', date: 'Nov 5, 2025', matches: 1 },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Match Found':
        return { bg: '#d1fae5', color: '#065f46' };
      case 'Claimed':
        return { bg: '#dbeafe', color: '#1e40af' };
      default:
        return { bg: '#fef3c7', color: '#92400e' };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Reports</Text>
        <Text style={styles.subtitle}>Track your lost item reports</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {reports.map((report) => {
          const statusStyle = getStatusStyle(report.status);
          
          return (
            <TouchableOpacity key={report.id} style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <View style={styles.reportIcon}>
                  <Text style={styles.reportIconText}>📦</Text>
                </View>
                <View style={styles.reportInfo}>
                  <Text style={styles.reportName}>{report.name}</Text>
                  <Text style={styles.reportDate}>📅 {report.date}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                  <Text style={[styles.statusText, { color: statusStyle.color }]}>
                    {report.status}
                  </Text>
                </View>
              </View>

              <View style={styles.reportDetails}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Matches Found:</Text>
                  <Text style={styles.detailValue}>{report.matches}</Text>
                </View>
              </View>

              {report.status === 'Match Found' && (
                <TouchableOpacity style={styles.viewMatchButton}>
                  <Text style={styles.viewMatchButtonText}>View Match Details</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          );
        })}

        {reports.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>No Reports Yet</Text>
            <Text style={styles.emptyText}>
              You haven't reported any lost items. Tap the Report Lost button to get started.
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
  },
  header: {
    backgroundColor: '#0e7490',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  reportIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0f2f7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reportIconText: {
    fontSize: 24,
  },
  reportInfo: {
    flex: 1,
  },
  reportName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  reportDate: {
    fontSize: 13,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  reportDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  viewMatchButton: {
    backgroundColor: '#0e7490',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  viewMatchButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
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
    paddingHorizontal: 40,
  },
});

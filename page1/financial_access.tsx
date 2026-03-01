import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

type FinanceCheck = {
  id: string;
  title: string;
  description: string;
  instructions: string;
};

const FINANCE_CHECKS: FinanceCheck[] = [
  {
    id: "f1",
    title: "Open a new bank account in your name only",
    description: "Secure your banking independence",
    instructions: "Settings → Face ID & Passcode (iPhone) or Screen Lock (Android)",
  },
  {
    id: "f2",
    title: "Remove them from any shared credit cards",
    description: "Protect your credit profile",
    instructions: "System Settings → Login Password (Apple) or Sign In → PIN (Windows)",
  },
  {
    id: "f3",
    title: "Update your direct deposit to a new account",
    description: "Ensure your income goes to a secure account",
    instructions: "Gmail, Outlook, Apple Mail",
  },
  {
    id: "f4",
    title: "Change passwords for streaming services",
    description: "Secure your digital entertainment accounts",
    instructions: "Netflix, Spotify, Disney+, Hulu, HBO Max, etc.",
  },
  {
    id: "f5",
    title: "Update billing info for all subscriptions",
    description: "Review and secure all recurring charges",
    instructions: "Check your email for 'receipt' emails to find every service",
  },
  {
    id: "f6",
    title: "Remove from Amazon Household",
    description: "Revoke shared Amazon account access",
    instructions: "amazon.com → Account",
  },
  {
    id: "f7",
    title: "Separate from shared phone plan",
    description: "Establish independent mobile service",
    instructions: "Call your carrier",
  },
];

type FinanceAccessProps = {
  onComplete: (checkedItems: string[]) => void;
};

export default function FinanceAccess({ onComplete }: FinanceAccessProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleComplete = () => {
    const completed = Object.keys(checkedItems).filter((key) => checkedItems[key]);
    onComplete(completed);
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPercentage = (completedCount / FINANCE_CHECKS.length) * 100;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Financial Access Security</Text>
        <Text style={styles.subtitle}>Complete these steps to secure your financial accounts</Text>

        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progressPercentage}%` }]} />
        </View>
      </View>

      <View style={styles.checklistContainer}>
        {FINANCE_CHECKS.map((check) => (
          <View key={check.id} style={styles.checkItem}>
            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={() => toggleCheck(check.id)}
            >
              <View style={[styles.checkbox, checkedItems[check.id] && styles.checkboxChecked]}>
                {checkedItems[check.id] && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </TouchableOpacity>

            <View style={styles.checkContent}>
              <Text style={styles.checkTitle}>{check.title}</Text>
              <Text style={styles.checkDescription}>{check.description}</Text>
              <Text style={styles.checkInstructions}>{check.instructions}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
          <Text style={styles.completeButtonText}>Complete</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#E91E63',
    borderRadius: 4,
  },
  checklistContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  checkItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  checkboxContainer: {
    marginRight: 12,
    justifyContent: 'flex-start',
    paddingTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkContent: {
    flex: 1,
  },
  checkTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  checkDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  checkInstructions: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  completeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
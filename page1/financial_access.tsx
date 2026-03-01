import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { useFonts } from 'expo-font';

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
  const [fontsLoaded] = useFonts({
    'NoTears': require('../assets/fonts/No Tears.ttf'),
    'NoTears-Bold': require('../assets/fonts/No Tears Bold.ttf'),
  });

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleComplete = () => {
    const completed = Object.keys(checkedItems).filter((key) => checkedItems[key]);
    onComplete(completed);
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPercentage = (completedCount / FINANCE_CHECKS.length) * 100;

  return (
    <ScrollView contentContainerStyle={styles.page}>
      {/* Lined notebook paper background */}
      <View style={styles.linesContainer} pointerEvents="none">
        {Array.from({ length: 50 }).map((_, i) => (
          <View key={i} style={styles.line} />
        ))}
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.chapterLabel, { fontFamily: fontsLoaded ? 'NoTears-Bold' : 'Georgia' }]}>
          Financial Access
        </Text>
        <Text style={styles.diaryEntry}>Dear Diary,</Text>
        <Text style={styles.diaryBody}>Time to take back control of my finances...</Text>
      </View>

      {/* Progress — plain text, no card */}
      <View style={styles.progressLabelRow}>
        <Text style={[styles.progressLabel, { fontFamily: fontsLoaded ? 'NoTears-Bold' : 'Georgia' }]}>
          Progress
        </Text>
        <Text style={[styles.progressCount, { fontFamily: fontsLoaded ? 'NoTears-Bold' : 'Georgia' }]}>
          {completedCount} / {FINANCE_CHECKS.length}
        </Text>
      </View>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progressPercentage}%` as any }]} />
      </View>

      {/* Checklist */}
      <View style={styles.checklistContainer}>
        {FINANCE_CHECKS.map((check) => (
          <TouchableOpacity
            key={check.id}
            style={[styles.card, styles.checkItem, checkedItems[check.id] && styles.checkItemDone]}
            onPress={() => toggleCheck(check.id)}
            activeOpacity={0.75}
          >
            <View style={[styles.checkbox, checkedItems[check.id] && styles.checkboxChecked]}>
              {checkedItems[check.id] && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <View style={styles.checkContent}>
              <Text style={[
                styles.checkTitle,
                { fontFamily: fontsLoaded ? 'NoTears-Bold' : 'Georgia' },
                checkedItems[check.id] && styles.checkTitleDone,
              ]}>
                {check.title}
              </Text>
              <Text style={styles.checkDescription}>{check.description}</Text>
              <Text style={styles.checkInstructions}>{check.instructions}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Complete button */}
      <TouchableOpacity style={styles.completeButton} onPress={handleComplete} activeOpacity={0.8}>
        <Text style={[styles.completeButtonText, { fontFamily: fontsLoaded ? 'NoTears-Bold' : 'Georgia' }]}>
          Complete
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const CARD_BG = '#e8e0e8';
const LINE_COLOR = '#d8d0dc';
const TEXT_DARK = '#1a1a2e';
const TEXT_PINK = '#c0607a';

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    backgroundColor: '#faf5f7',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    position: 'relative',
  },
  linesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 60,
    gap: 0,
  },
  line: {
    height: 1,
    backgroundColor: LINE_COLOR,
    marginVertical: 11,
    opacity: 0.5,
  },
  header: {
    marginBottom: 24,
  },
  chapterLabel: {
    fontSize: 36,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 8,
  },
  diaryEntry: {
    fontFamily: 'Georgia',
    fontSize: 16,
    color: TEXT_PINK,
    fontStyle: 'italic',
    opacity: 0.8,
    marginTop: 12,
  },
  diaryBody: {
    fontFamily: 'Georgia',
    fontSize: 16,
    color: TEXT_PINK,
    fontStyle: 'italic',
    opacity: 0.7,
    marginTop: 4,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    marginTop: 20,
  },
  progressLabel: {
    fontSize: 18,
    color: TEXT_DARK,
  },
  progressCount: {
    fontSize: 18,
    color: TEXT_PINK,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#d0c0cc',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: TEXT_PINK,
    borderRadius: 4,
  },
  checklistContainer: {
    gap: 0,
  },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 24,
    marginTop: 16,
    marginLeft: 16,
    shadowColor: '#c090a8',
    shadowOffset: { width: 2, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkItemDone: {
    opacity: 0.6,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#d0b8c4',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    marginTop: 2,
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: TEXT_PINK,
    borderColor: TEXT_PINK,
  },
  checkmark: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  checkContent: {
    flex: 1,
  },
  checkTitle: {
    fontSize: 18,
    color: TEXT_DARK,
    marginBottom: 4,
  },
  checkTitleDone: {
    color: TEXT_PINK,
    textDecorationLine: 'line-through',
  },
  checkDescription: {
    fontFamily: 'Georgia',
    fontSize: 14,
    color: '#886878',
    marginBottom: 5,
  },
  checkInstructions: {
    fontFamily: 'Georgia',
    fontSize: 13,
    color: '#b088a0',
    fontStyle: 'italic',
  },
  completeButton: {
    marginTop: 16,
    marginLeft: 16,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: TEXT_PINK,
    alignItems: 'center',
    shadowColor: '#c090a8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  completeButtonText: {
    fontSize: 18,
    color: '#fff',
  },
});
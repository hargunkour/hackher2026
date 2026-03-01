import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useFonts } from 'expo-font';
import DeviceAccess from './device_access';
import FinanceAccess from './financial_access';
import SocialAccess from './social_access';

type Category = "device" | "social" | "finance";

type Question = {
  id: string;
  next_section: Category;
  text: string;
};

const QUESTIONS: Question[] = [
  {
    id: "s1",
    next_section: "social",
    text: "Have you ever shared your social media passwords with your partner? (Instagram, Snapchat, TikTok, etc.)",
  },
  {
    id: "s2",
    next_section: "social",
    text: "Are you logged into your social media accounts on a device they can access? (their phone, shared tablet, laptop)",
  },
  {
    id: "s3",
    next_section: "social",
    text: "Do they have access to your email connected to your social media? (Email access = full account recovery risk)",
  },
  {
    id: "d4",
    next_section: "device",
    text: "Do they know your phone unlock passcode or Face ID pattern?",
  },
  {
    id: "d5",
    next_section: "device",
    text: "Have they ever used your phone or laptop without you present?",
  },
  {
    id: "d6",
    next_section: "device",
    text: "Do you share location with them through apps like Find My, Snapchat, Life360, Google Maps, etc.?",
  },
  {
    id: "f7",
    next_section: "finance",
    text: "Do they have access to your banking app, credit card, or financial passwords?",
  },
  {
    id: "f8",
    next_section: "finance",
    text: "Do you share subscriptions, payment methods, or joint financial accounts?",
  },
];

const anyYes = (ids: string[], answers: Record<string, boolean>): boolean => 
  ids.some((id) => answers[id] === true);

const determineNextPage = (answers: Record<string, boolean>): Category | null => {
  if (anyYes(["d4", "d5", "d6"], answers)) return "device";
  if (anyYes(["f7", "f8"], answers)) return "finance";
  if (anyYes(["s1", "s2", "s3"], answers)) return "social";
  return null;
};

// Heart progress indicator
const HeartProgress = ({ total, filled }: { total: number; filled: number }) => (
  <View style={styles.heartsRow}>
    {Array.from({ length: total }).map((_, i) => (
      <Text key={i} style={[styles.heart, i < filled ? styles.heartFilled : styles.heartEmpty]}>
        {i < filled ? '♥' : '♡'}
      </Text>
    ))}
  </View>
);

export default function Quiz() {
  const [fontsLoaded] = useFonts({
    'NoTears': require('../assets/fonts/No Tears.ttf'),
    'NoTears-Bold': require('../assets/fonts/No Tears Bold.ttf'),
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [nextSection, setNextSection] = useState<Category | null>(null);
  const [completedSections, setCompletedSections] = useState<Set<Category>>(new Set());

  const handleAnswer = (answer: boolean) => {
    const currentQuestion = QUESTIONS[currentIndex];
    const newAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(newAnswers);

    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const section = determineNextPage(newAnswers);
      if (section) {
        setNextSection(section);
      }
    }
  };

  const handleSectionComplete = (section: Category) => {
    const newCompleted = new Set(completedSections);
    newCompleted.add(section);
    setCompletedSections(newCompleted);

    if (section === "device") {
      if (anyYes(["f7", "f8"], answers)) {
        setNextSection("finance");
      } else if (anyYes(["s1", "s2", "s3"], answers)) {
        setNextSection("social");
      } else {
        setNextSection(null);
      }
    } else if (section === "finance") {
      if (anyYes(["s1", "s2", "s3"], answers)) {
        setNextSection("social");
      } else {
        setNextSection(null);
      }
    } else if (section === "social") {
      setNextSection(null);
    }
  };

  // Show empty completion page when all sections are done
  if (nextSection === null && completedSections.size > 0) {
    return <View style={{ flex: 1 }} />;
  }

  // Show DeviceAccess if needed
  if (nextSection === "device") {
    return (
      <DeviceAccess 
        onComplete={() => handleSectionComplete("device")}
      />
    );
  }

  // Show FinanceAccess if needed
  if (nextSection === "finance") {
    return (
      <FinanceAccess 
        onComplete={() => handleSectionComplete("finance")}
      />
    );
  }

  // Show SocialAccess if needed
  if (nextSection === "social") {
    return (
      <SocialAccess 
        onComplete={() => handleSectionComplete("social")}
      />
    );
  }

  // Graceful fallback until custom font loads
  const chapterFont = fontsLoaded ? 'NoTears-Bold' : 'Georgia';
  const subtitleFont = fontsLoaded ? 'NoTears' : 'Georgia';

  const currentQuestion = QUESTIONS[currentIndex];

  return (
    <ScrollView contentContainerStyle={styles.page}>
      {/* Lined notebook paper lines — decorative */}
      <View style={styles.linesContainer} pointerEvents="none">
        {Array.from({ length: 30 }).map((_, i) => (
          <View key={i} style={styles.line} />
        ))}
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.chapterLabel, { fontFamily: chapterFont }]}>Chapter 1</Text>
        <Text style={styles.diaryEntry}>Dear Diary,</Text>
        <Text style={styles.diaryBody}>I will answer a few questions to build my plan first...</Text>
      </View>

      {/* Gold star sticker — custom graphic */}
      <Image
        source={require('../assets/images/goldstar.png')}
        style={styles.starSticker}
        resizeMode="contain"
      />

      {/* Question Card */}
      <View style={styles.card}>
        {/* Glitter blob decoration (top right) */}
        <Image
        source={require('../assets/images/greycallout.png')}
        style={styles.calloutSticker}
        resizeMode="contain"
      />

        {/* Heart progress */}
        <HeartProgress total={QUESTIONS.length} filled={currentIndex + 1} />

        {/* Question text */}
        <Text style={styles.questionText}>{currentQuestion.text}</Text>

        {/* Answer buttons */}
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[styles.answerBtn, styles.answerBtnLeft]}
            onPress={() => handleAnswer(true)}
            activeOpacity={0.75}
          >
            <Text style={styles.answerBtnText}>yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.answerBtn, styles.answerBtnRight]}
            onPress={() => handleAnswer(false)}
            activeOpacity={0.75}
          >
            <Text style={styles.answerBtnText}>no</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Pink washi tape — custom graphic */}
      <Image
        source={require('../assets/images/pinkwashi.png')}
        style={styles.washiTape}
        resizeMode="stretch"
      />
    </ScrollView>
  );
}

const PINK = '#e8a0b0';
const SOFT_PINK = '#f9e4ea';
const BLUSH = '#f2c4d0';
const CARD_BG = '#e8e0e8';
const LINE_COLOR = '#d8d0dc';
const TEXT_DARK = '#1a1a2e';
const TEXT_PINK = '#c0607a';
const TEXT_MUTED = '#b088a0';

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

  // Header
  header: {
    marginBottom: 24,
  },
  chapterLabel: {
    fontFamily: 'noTears-bold',
    fontSize: 36,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'noTears-bold',
    fontSize: 16,
    color: TEXT_PINK,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  diaryEntry: {
    fontFamily: 'noTears-bold',
    fontSize: 16,
    color: TEXT_PINK,
    fontStyle: 'italic',
    opacity: 0.8,
    marginTop: 12,
  },
  diaryBody: {
    fontFamily: 'noTears-bold',
    fontSize: 16,
    color: TEXT_PINK,
    fontStyle: 'italic',
    opacity: 0.7,
    marginTop: 4,
  },

  // Gold star custom image — positioned to overlap card top-left
  starSticker: {
    position: 'absolute',
    top: 178,
    left: 12,
    width: 56,
    height: 56,
    zIndex: 10,
  },

  // callout custom image — positioned to overlap card top-right
  calloutSticker: {
    position: 'absolute',
    top: 1,
    left: 260,
    width: 70,
    height: 56,
    zIndex: 10,
  },

  // Card
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
  glitterBlob: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 52,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#c8d4e8',
    opacity: 0.7,
  },

  // Hearts
  heartsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 20,
    marginTop: 4,
  },
  heart: {
    fontSize: 20,
    lineHeight: 24,
  },
  heartFilled: {
    color: TEXT_PINK,
  },
  heartEmpty: {
    color: '#b8a8c0',
  },

  // Question
  questionText: {
    fontFamily: 'NoTears-Bold',
    fontSize: 20,
    color: TEXT_DARK,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 28,
    paddingHorizontal: 4,
  },

  // Buttons
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  answerBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    shadowColor: '#c090a8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  answerBtnLeft: {},
  answerBtnRight: {},
  answerBtnText: {
    fontFamily: 'noTears-Bold',
    fontSize: 18,
    color: TEXT_DARK,
  },

  // Pink washi tape custom image
  washiTape: {
    marginTop: -15,
    height: 42,
    width: 120,
    transform: [{ rotate: '-2deg' }],
    opacity: 0.85,
  },
});
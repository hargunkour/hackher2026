import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";

type SocialPlatform = {
  id: string;
  name: string;
  icon: string;
  steps: string[];
};

const SOCIAL_PLATFORMS: Record<string, SocialPlatform> = {
  instagram: {
    id: "instagram",
    name: "Instagram",
    icon: "instagram",
    steps: [
      "Setting → Privacy → Set Account to Private",
      "Setting → Privacy → Story → Hide from Blocked",
      "Block/Unfollow your accounts (their profile)",
    ],
  },
  tiktok: {
    id: "tiktok",
    name: "TikTok",
    icon: "music-box-multiple",
    steps: [
      "Setting → Privacy → Set Account to Private",
      "Setting → Privacy → Comments",
      "Block their account (their profile → Block)",
    ],
  },
  snapchat: {
    id: "snapchat",
    name: "Snapchat",
    icon: "ghost",
    steps: [
      "Setting → Privacy → Set to My Friends",
      "Setting → Privacy → Story → Hide from Blocked",
      "Block their account (their profile → Block)",
    ],
  },
  facebook: {
    id: "facebook",
    name: "Facebook",
    icon: "facebook",
    steps: [
      "Setting → Privacy → Set Account to Friends",
      "Setting → Privacy → Story → Hide from Blocked",
      "Block their account (their profile → Block)",
    ],
  },
  location: {
    id: "location",
    name: "Find My/Life360",
    icon: "map-marker",
    steps: [
      "Remove from Family/Friends sharing",
      "Turn off location services for the app",
      "Delete the app if not needed",
    ],
  },
};

type SocialAccessProps = {
  onComplete: () => void;
};

export default function SocialAccess({ onComplete }: SocialAccessProps) {
  const [fontsLoaded] = useFonts({
    "NoTears": require("../assets/fonts/No Tears.ttf"),
    "NoTears-Bold": require("../assets/fonts/No Tears Bold.ttf"),
  });

  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setCompletedSteps({});
    AsyncStorage.removeItem("socialsProgress");
  }, []);

  useEffect(() => {
    saveProgress();
  }, [completedSteps]);

  const saveProgress = async () => {
    try {
      await AsyncStorage.setItem("socialsProgress", JSON.stringify(completedSteps));
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const toggleExpanded = (platformId: string) => {
    setExpandedPlatform(expandedPlatform === platformId ? null : platformId);
  };

  const toggleStepCompletion = (platformId: string, stepIndex: number) => {
    const key = `${platformId}-${stepIndex}`;
    setCompletedSteps((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const platformList = Object.keys(SOCIAL_PLATFORMS);
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const totalSteps = Object.values(SOCIAL_PLATFORMS).reduce(
    (sum, platform) => sum + platform.steps.length,
    0
  );
  const progressPercentage = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;

  const renderPlatform = ({ item: platformId }: { item: string }) => {
    const platform = SOCIAL_PLATFORMS[platformId];
    const isExpanded = expandedPlatform === platformId;
    const steps = platform.steps;
    const platformCompletedCount = steps.filter(
      (_, index) => completedSteps[`${platformId}-${index}`]
    ).length;
    const platformProgress = steps.length > 0 ? (platformCompletedCount / steps.length) * 100 : 0;

    return (
      <View style={styles.card}>
        {/* Platform header row */}
        <TouchableOpacity
          style={styles.platformHeader}
          onPress={() => toggleExpanded(platformId)}
          activeOpacity={0.75}
        >
          <View style={styles.platformTitleContainer}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons
                name={platform.icon as any}
                size={22}
                color={TEXT_PINK}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.platformName, { fontFamily: fontsLoaded ? "NoTears-Bold" : "Georgia" }]}>
                {platform.name}
              </Text>
              <Text style={styles.stepCount}>{steps.length} steps</Text>
            </View>
          </View>
          <MaterialCommunityIcons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={22}
            color={TEXT_PINK}
          />
        </TouchableOpacity>

        {/* Expanded steps */}
        {isExpanded && (
          <>
            {/* Per-platform progress bar */}
            <View style={styles.platformProgressBar}>
              <View style={[styles.platformProgressFill, { width: `${platformProgress}%` as any }]} />
            </View>

            <View style={styles.stepsContainer}>
              {steps.map((step, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.stepItem}
                  onPress={() => toggleStepCompletion(platformId, index)}
                  activeOpacity={0.75}
                >
                  <View style={[styles.checkbox, completedSteps[`${platformId}-${index}`] && styles.checkboxChecked]}>
                    {completedSteps[`${platformId}-${index}`] && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                  <Text style={[
                    styles.stepText,
                    { fontFamily: fontsLoaded ? "Georgia" : "Georgia" },
                    completedSteps[`${platformId}-${index}`] && styles.stepTextCompleted,
                  ]}>
                    {index + 1}. {step}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </View>
    );
  };

  return (
    <FlatList
      data={platformList}
      renderItem={renderPlatform}
      keyExtractor={(item) => item}
      contentContainerStyle={styles.page}
      ListHeaderComponent={
        <>
          {/* Lined notebook paper */}
          <View style={styles.linesContainer} pointerEvents="none">
            {Array.from({ length: 50 }).map((_, i) => (
              <View key={i} style={styles.line} />
            ))}
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.chapterLabel, { fontFamily: fontsLoaded ? "NoTears-Bold" : "Georgia" }]}>
              Social Access
            </Text>
            <Text style={styles.diaryEntry}>Dear Diary,</Text>
            <Text style={styles.diaryBody}>Time to reclaim my digital presence...</Text>
          </View>

          {/* Overall progress — plain text */}
          <View style={styles.progressLabelRow}>
            <Text style={[styles.progressLabel, { fontFamily: fontsLoaded ? "NoTears-Bold" : "Georgia" }]}>
              Progress
            </Text>
            <Text style={[styles.progressCount, { fontFamily: fontsLoaded ? "NoTears-Bold" : "Georgia" }]}>
              {completedCount} / {totalSteps}
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progressPercentage}%` as any }]} />
          </View>
        </>
      }
      ListFooterComponent={
        completedCount === totalSteps && completedCount > 0 ? (
          <TouchableOpacity style={styles.completeButton} onPress={onComplete} activeOpacity={0.8}>
            <Text style={[styles.completeButtonText, { fontFamily: fontsLoaded ? "NoTears-Bold" : "Georgia" }]}>
              All Done! ✓
            </Text>
          </TouchableOpacity>
        ) : null
      }
    />
  );
}

const CARD_BG = "#e8e0e8";
const LINE_COLOR = "#d8d0dc";
const TEXT_DARK = "#1a1a2e";
const TEXT_PINK = "#c0607a";

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    backgroundColor: "#faf5f7",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    position: "relative",
  },

  // Lined paper
  linesContainer: {
    position: "absolute",
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
    fontSize: 36,
    fontWeight: "700",
    color: TEXT_DARK,
    marginBottom: 8,
  },
  diaryEntry: {
    fontFamily: "Georgia",
    fontSize: 16,
    color: TEXT_PINK,
    fontStyle: "italic",
    opacity: 0.8,
    marginTop: 12,
  },
  diaryBody: {
    fontFamily: "Georgia",
    fontSize: 16,
    color: TEXT_PINK,
    fontStyle: "italic",
    opacity: 0.7,
    marginTop: 4,
  },

  // Progress
  progressLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    width: "100%",
    height: 8,
    backgroundColor: "#d0c0cc",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressBar: {
    height: "100%",
    backgroundColor: TEXT_PINK,
    borderRadius: 4,
  },

  // Platform card — matches device/finance card style
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    marginTop: 16,
    marginLeft: 16,
    shadowColor: "#c090a8",
    shadowOffset: { width: 2, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
    overflow: "hidden",
  },

  // Platform header row
  platformHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  platformTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#d0b8c4",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  platformName: {
    fontSize: 18,
    color: TEXT_DARK,
    marginBottom: 2,
  },
  stepCount: {
    fontFamily: "Georgia",
    fontSize: 12,
    color: "#b088a0",
    fontStyle: "italic",
  },

  // Per-platform progress bar (inside expanded card)
  platformProgressBar: {
    height: 6,
    backgroundColor: "#d0b8c4",
    marginHorizontal: 20,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 4,
  },
  platformProgressFill: {
    height: "100%",
    backgroundColor: TEXT_PINK,
    borderRadius: 3,
  },

  // Steps
  stepsContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: "#f0e8ec",
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#d0b8c4",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: TEXT_PINK,
    borderColor: TEXT_PINK,
  },
  checkmark: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: TEXT_DARK,
    lineHeight: 20,
  },
  stepTextCompleted: {
    color: TEXT_PINK,
    textDecorationLine: "line-through",
    opacity: 0.6,
  },

  // Complete button
  completeButton: {
    marginTop: 16,
    marginLeft: 16,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: TEXT_PINK,
    alignItems: "center",
    shadowColor: "#c090a8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  completeButtonText: {
    fontSize: 18,
    color: "#fff",
  },
});
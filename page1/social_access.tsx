import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Clear progress on mount
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
    setCompletedSteps((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderPlatform = ({ item: platformId }: { item: string }) => {
    const platform = SOCIAL_PLATFORMS[platformId];
    const isExpanded = expandedPlatform === platformId;
    const steps = platform.steps;
    const platformCompletedCount = steps.filter(
      (_, index) => completedSteps[`${platformId}-${index}`]
    ).length;

    return (
      <View style={styles.platformCard}>
        <TouchableOpacity
          style={styles.platformHeader}
          onPress={() => toggleExpanded(platformId)}
        >
          <View style={styles.platformTitleContainer}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons
                name={platform.icon as any}
                size={24}
                color="#C97D9E"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.platformName}>{platform.name}</Text>
              <Text style={styles.stepCount}>{steps.length} steps</Text>
            </View>
          </View>
          <MaterialCommunityIcons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={24}
            color="#C97D9E"
          />
        </TouchableOpacity>

        {isExpanded && (
          <>
            <View style={styles.progressSection}>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${
                        steps.length > 0
                          ? (platformCompletedCount / steps.length) * 100
                          : 0
                      }%`,
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.stepsContainer}>
              {steps.map((step, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.stepItem}
                  onPress={() => toggleStepCompletion(platformId, index)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      completedSteps[`${platformId}-${index}`] &&
                        styles.checkboxChecked,
                    ]}
                  >
                    {completedSteps[`${platformId}-${index}`] && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.stepText,
                      completedSteps[`${platformId}-${index}`] &&
                        styles.stepTextCompleted,
                    ]}
                  >
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

  const platformList = Object.keys(SOCIAL_PLATFORMS);
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const totalSteps = Object.values(SOCIAL_PLATFORMS).reduce(
    (sum, platform) => sum + platform.steps.length,
    0
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Social Media Security</Text>
        <Text style={styles.headerSubtitle}>Reclaim your digital presence</Text>
      </View>

      <View style={styles.overallProgressSection}>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${
                  totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0
                }%`,
              },
            ]}
          />
        </View>
      </View>

      <FlatList
        data={platformList}
        renderItem={renderPlatform}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.listContent}
      />

      {completedCount === totalSteps && completedCount > 0 && (
        <View style={styles.completeButtonContainer}>
          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => onComplete()}
          >
            <Text style={styles.completeButtonText}>All Done! ✓</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    fontWeight: "400",
  },
  overallProgressSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
  },
  progressSection: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  progressBarContainer: {
    width: "100%",
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#E91E63",
    borderRadius: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  platformCard: {
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  platformHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
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
    borderColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  platformName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
  },
  stepCount: {
    fontSize: 12,
    color: "#999",
  },
  stepsContainer: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fafafa",
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  checkmark: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    color: "#555",
    lineHeight: 18,
  },
  stepTextCompleted: {
    color: "#999",
    textDecorationLine: "line-through",
  },
  completeButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  completeButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  completeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
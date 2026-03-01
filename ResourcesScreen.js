import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from "react-native";
import * as Location from "expo-location";
import { resources } from "./resources";
import ResourceCard from "./ResourceCard";
import { useFonts } from 'expo-font';

export default function ResourcesScreen() {
  const [fontsLoaded] = useFonts({
    'NoTears': require('./assets/fonts/No Tears.ttf'),
    'NoTears-Bold': require('./assets/fonts/No Tears Bold.ttf'),
  });

  const chapterFont = fontsLoaded ? 'NoTears-Bold' : 'Georgia';

  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [resourceList, setResourceList] = useState([]);
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Location permission denied");
        setResourceList(resources.DEFAULT);
        setLoading(false);
        setDebugInfo("Permission denied");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      console.log("Location coords:", currentLocation.coords);
      setLocation(currentLocation.coords);
      setDebugInfo(
        `Getting location: ${currentLocation.coords.latitude.toFixed(4)}, ${currentLocation.coords.longitude.toFixed(4)}`
      );

      // Use Nominatim (OpenStreetMap) for reverse geocoding
      const { city, province } = await reverseGeocodeWithNominatim(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      );

      console.log("City found:", city);
      console.log("Province found:", province);
      setDebugInfo(`Location: ${city || "Unknown city"}, ${province || "Unknown province"}`);

      // Try city first, then province, then default
      let filtered = [];

      if (city && resources[city]) {
        console.log("Found city-specific resources for:", city);
        filtered = resources[city];
      } else if (province && resources[province]) {
        console.log("Found province-level resources for:", province);
        filtered = resources[province];
      } else {
        console.log("No city or province match, using DEFAULT");
        filtered = resources.DEFAULT;
      }

      setResourceList(filtered);
      setLoading(false);
    } catch (error) {
      console.error("Location error:", error);
      setDebugInfo(`Error: ${error.message}`);
      setResourceList(resources.DEFAULT);
      setLoading(false);
    }
  };

  const reverseGeocodeWithNominatim = async (lat, lng) => {
    try {
      console.log(`Calling Nominatim API for ${lat}, ${lng}`);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        {
          headers: {
            "User-Agent": "HackHer2026App (hackher@example.com)",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Nominatim response:", JSON.stringify(data, null, 2));

      // Extract city and province from address
      const address = data.address || {};
      const city = address.city || address.town || address.village;
      const province = address.state || address.province;

      console.log("Extracted - City:", city, "Province:", province);
      console.log("Looking in resources for:", city);
      console.log("Available city keys:", Object.keys(resources).filter(k => !["DEFAULT", "Ontario", "British Columbia", "Alberta", "Quebec"].includes(k)));

      return { city, province };
    } catch (error) {
      console.error("Nominatim error:", error);
      setDebugInfo(`Geocoding failed: ${error.message}`);
      return { city: null, province: null };
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.diaryEntry}>Finding nearby support...</Text>
        {debugInfo && <Text style={styles.debug}>{debugInfo}</Text>}
      </View>
    );
  }

  return (
    <ScrollView style={styles.page}>
      {/* Lined notebook paper lines — decorative */}
      <View style={styles.linesContainer} pointerEvents="none">
        {Array.from({ length: 30 }).map((_, i) => (
          <View key={i} style={styles.line} />
        ))}
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.chapterLabel, { fontFamily: chapterFont }]}>Nearby Support Resources</Text>
        <Text style={styles.diaryEntry}>Dear Diary,</Text>
        <Text style={styles.diaryBody}>I am not alone, and these are the people who prove it.</Text>
      </View>


      {debugInfo && <Text style={styles.subtitle}>{debugInfo}</Text>}

      {resourceList.length > 0 ? (
        resourceList.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))
      ) : (
        <Text style={styles.noResults}>No resources found</Text>
      )}
    </ScrollView>
  );

} const PINK = '#e8a0b0';
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
  diaryEntry: {
    fontFamily: 'noTears-bold',
    fontSize: 18,
    color: TEXT_PINK,
    fontStyle: 'italic',
    opacity: 0.8,
    marginTop: 12,
  },
  diaryBody: {
    fontFamily: 'noTears-bold',
    fontSize: 18,
    color: TEXT_PINK,
    fontStyle: 'italic',
    opacity: 0.7,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    color: "gray",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  debug: {
    marginTop: 10,
    fontSize: 12,
    color: "red",
    textAlign: "center",
  },
  noResources: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    marginTop: 20,
  },
});
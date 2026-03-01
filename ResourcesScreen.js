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

export default function ResourcesScreen() {
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
        <Text>Finding nearby support...</Text>
        {debugInfo && <Text style={styles.debug}>{debugInfo}</Text>}
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Nearby Support Resources</Text>

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
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
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
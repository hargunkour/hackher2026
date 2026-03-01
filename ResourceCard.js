import React from "react";
import { View, Text, TouchableOpacity, Linking, StyleSheet } from "react-native";

export default function ResourceCard({ resource }) {
  const handleCall = () => {
    Linking.openURL(`tel:${resource.phone}`);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{resource.name}</Text>
      <Text style={styles.description}>{resource.description}</Text>

      <TouchableOpacity style={styles.button} onPress={handleCall}>
        <Text style={styles.buttonText}>Call {resource.phone}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
      card: {
    backgroundColor: "#F4F1FA",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6
  },
  description: {
    fontSize: 14,
    marginBottom: 10
  },
  button: {
    backgroundColor: "#6C63FF",
    padding: 10,
    borderRadius: 8
  },
  buttonText: {
    color: "white",
    textAlign: "center"
  }
});
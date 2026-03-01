import React from "react";
import { View, Text, TouchableOpacity, Linking, StyleSheet } from "react-native";

const PINK = '#e8a0b0';
const CARD_BG = '#e8e0e8';
const TEXT_DARK = '#1a1a2e';
const TEXT_PINK = '#c0607a';

export default function ResourceCard({ resource }) {
  const handleCall = () => {
    Linking.openURL(`tel:${resource.phone}`);
  };

  return (
    <View style={styles.card}>
      {/* Glitter blob decoration */}
      <View style={styles.glitterBlob} />

      <Text style={styles.name}>{resource.name}</Text>
      <Text style={styles.description}>{resource.description}</Text>

      <TouchableOpacity style={styles.button} onPress={handleCall}>
        <Text style={styles.buttonText}>📞 Call {resource.phone}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 8,
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
  name: {
    fontFamily: 'NoTears-Bold',
    fontSize: 20,
    color: TEXT_DARK,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    fontFamily: 'NoTears-Bold',
    fontSize: 18,
    color: TEXT_PINK,
    fontStyle: 'italic',
    marginBottom: 16,
    lineHeight: 20,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    shadowColor: '#c090a8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    fontFamily: 'NoTears-Bold',
    fontSize: 16,
    color: TEXT_DARK,
    fontWeight: '600',
  },
});
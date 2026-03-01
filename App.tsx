import React from 'react';
import { View, Text } from 'react-native';
import Quiz from './page1/quiz';

export default function App() {
  return (
    <View style={{ flex: 1, paddingTop: 50 }}>
      <Quiz />
    </View>
  );
}
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, Button } from 'react-native';
import React, { useState } from 'react';

//PAGES
import ResourcesScreen from './ResourcesScreen';
import Quiz from './page1/quiz';
import SignInScreen from "./signin";
import ExEmailScreen from "./exEmail";
import DashboardScreen from "./riskDashboard";

const Stack = createNativeStackNavigator();

const resourcesButton = (navigation: any) => ({
  headerRight: () => (
    <Button
      title="Resources"
      onPress={() => navigation.navigate('Resources')}
    />
  ),
});

function MainScreen() {
  const [activeTab, setActiveTab] = useState('Chapters');

  return (
    <View style={styles.container}>
      {/* Header with Tab Navigation */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>UnLink</Text>
        <View style={styles.rightButtons}>
          <Pressable
            style={[styles.tabButton, activeTab === 'Chapters' && styles.activeTab]}
            onPress={() => setActiveTab('Chapters')}
          >
            <Text style={[styles.tabText, activeTab === 'Chapters' && styles.activeTabText]}>
              Chapters
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tabButton, activeTab === 'Resources' && styles.activeTab]}
            onPress={() => setActiveTab('Resources')}
          >
            <Text style={[styles.tabText, activeTab === 'Resources' && styles.activeTabText]}>
              Resources
            </Text>
          </Pressable>
        </View>
        <View style={{ flex: 1, paddingTop: 50 }}>
          <Quiz />
        </View>
        {/* Content Area */}
        <StatusBar style="auto" />
      </View>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Sign In">
        <Stack.Screen name="Sign In" component={SignInScreen} />
        <Stack.Screen name="exEmail" component={ExEmailScreen} options={({ navigation }) => resourcesButton(navigation)} />
        <Stack.Screen name="riskDashboard" component={DashboardScreen} options={({ navigation }) => resourcesButton(navigation)} />
        <Stack.Screen name="Quiz" component={Quiz} options={({ navigation }) => resourcesButton(navigation)} />
        <Stack.Screen name="Main" component={MainScreen} options={({ navigation }) => resourcesButton(navigation)} />
        <Stack.Screen name="Resources" component={ResourcesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 70,
    backgroundColor: '#6C63FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  rightButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeTab: {
    backgroundColor: 'white',
  },
  tabText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  activeTabText: {
    color: '#6C63FF',
  },
  contentContainer: {
    flex: 1,
  },
});



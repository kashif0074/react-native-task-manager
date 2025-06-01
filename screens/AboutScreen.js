import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // ✅ CORRECT for Expo


const COLORS = {
  light: {
    background: '#f9f9f9',
    cardBackground: '#ffffff',
    text: '#000000',
    muted: '#888888',
    primary: '#6200ee',
    secondary: '#03dac6',
  },
  dark: {
    background: '#121212',
    cardBackground: '#1e1e1e',
    text: '#ffffff',
    muted: '#aaaaaa',
    primary: '#bb86fc',
    secondary: '#03dac6',
  },
};

const SPACING = { m: 16 };
const RADIUS = { m: 12 };
const SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 4,
};
const TEXT_VARIANTS = {
  header: { fontSize: 26, fontWeight: 'bold', fontFamily: 'Roboto-Bold' },
  body: { fontSize: 18, fontFamily: 'Roboto-Regular' },
  footer: { fontSize: 16, fontFamily: 'Roboto-Regular' },
};

const AboutScreen = ({ isDarkMode }) => {
  const theme = isDarkMode ? COLORS.dark : COLORS.light;
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={[styles.title, { color: theme.text }]}>About Task Manager</Text>
        <LinearGradient
          colors={[theme.primary, theme.secondary]}
          style={styles.contentContainer}
        >
          <Text style={[styles.content, { color: theme.text }]}>
            Task Manager is a modern, feature-rich to-do list app built with React Native. It helps
            users manage tasks with advanced features like categorization, priority levels, due dates,
            and notes. Developed by Team Awesome as a college project.
          </Text>
          <Text style={[styles.content, { color: theme.text, marginTop: SPACING.m }]}>
            Team: Jane Doe, John Smith, Alex Johnson
          </Text>
          <Text style={[styles.footer, { color: theme.muted }]}>Version 1.1.0</Text>
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.m,
    justifyContent: 'center',
  },
  title: {
    ...TEXT_VARIANTS.header,
    marginBottom: SPACING.m,
  },
  contentContainer: {
    padding: SPACING.m,
    borderRadius: RADIUS.m,
    ...SHADOW,
  },
  content: {
    ...TEXT_VARIANTS.body,
    lineHeight: 26,
  },
  footer: {
    ...TEXT_VARIANTS.footer,
    marginTop: SPACING.m,
  },
});

export default AboutScreen;
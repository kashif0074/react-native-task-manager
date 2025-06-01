import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient'; // ✅ CORRECT for Expo


const COLORS = {
  light: {
    background: '#ffffff',
    text: '#000000',
    primary: '#6200ee',
    secondary: '#03dac6',
  },
  dark: {
    background: '#121212',
    text: '#ffffff',
    primary: '#bb86fc',
    secondary: '#03dac6',
  },
};

const SPACING = { s: 8, m: 16 };
const TEXT_VARIANTS = {
  header: { fontSize: 32, fontWeight: 'bold', fontFamily: 'Roboto-Bold' },
  body: { fontSize: 18, fontFamily: 'Roboto-Regular' },
};

const SplashScreen = ({ isDarkMode }) => {
  const theme = isDarkMode ? COLORS.dark : COLORS.light;
  const spinValue = new Animated.Value(0);
  const scaleValue = new Animated.Value(0.8);
  const fadeValue = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      ),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(fadeValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [spinValue, scaleValue, fadeValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient
      colors={[theme.primary, theme.secondary]}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <Animated.View style={[styles.logo, { transform: [{ rotate: spin }, { scale: scaleValue }] }]}>
        <Icon name="checkmark-done-circle" size={60} color={theme.text} />
      </Animated.View>
      <Animated.View style={{ opacity: fadeValue }}>
        <Text style={[styles.title, { color: theme.text }]}>Task Manager</Text>
        <Text style={[styles.subtitle, { color: theme.text }]}>Organize your life...</Text>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    marginBottom: SPACING.m,
  },
  title: {
    ...TEXT_VARIANTS.header,
    marginBottom: SPACING.s,
  },
  subtitle: {
    ...TEXT_VARIANTS.body,
  },
});

export default SplashScreen;
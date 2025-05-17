import React, { useRef, useEffect } from 'react';
import {
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Sun, Moon } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const animation = useRef(new Animated.Value(theme === 'light' ? 0 : 1)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: theme === 'light' ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [theme]);

  const knobTranslate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 32], // Adjusted for better alignment
  });

  return (
    <TouchableWithoutFeedback onPress={toggleTheme}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme === 'light' ? '#f0f0f0' : '#333',
            borderColor: theme === 'light' ? '#ccc' : '#555',
          },
        ]}
      >
        {/* Icons container */}
        <View style={styles.iconWrapper}>
          <View style={styles.icon}>
            <Sun 
              size={16} 
              color={theme === 'light' ? '#FFA500' : '#fff'} 
              style={{ opacity: theme === 'light' ? 1 : 0.8 }}
            />
          </View>
          <View style={styles.icon}>
            <Moon 
              size={16} 
              color={theme === 'dark' ? '#8FB4FF' : '#222'} 
              style={{ opacity: theme === 'dark' ? 1 : 0.8 }}
            />
          </View>
        </View>

        {/* Knob */}
        <Animated.View
          style={[
            styles.knob,
            {
              transform: [{ translateX: knobTranslate }],
              backgroundColor: theme === 'light' ? '#ffffff' : '#222',
              shadowColor: theme === 'light' ? '#000' : '#111',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 2,
              elevation: 2,
            },
          ]}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 64,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    padding: 0, // Removed padding for better alignment
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    justifyContent: 'center',
  },
  iconWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    zIndex: 1,
  },
  icon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  knob: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    left: 2, // Fixed position from left instead of using transform only
    zIndex: 2,
  },
});

export default ThemeToggle;
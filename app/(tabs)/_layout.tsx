import React from "react";
import { Tabs } from 'expo-router';
import { Clock, History, CirclePlus as PlusCircle } from 'lucide-react-native';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from "@/context/ThemeContext";
import { darkTheme, lightTheme } from "@/styles/theme";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  const {theme} = useTheme();
  const colors = theme === 'light' ? lightTheme : darkTheme;
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.activeicon, // Primary purple
        tabBarInactiveTintColor: '#9E9E9E',
        tabBarStyle: [
          {backgroundColor : colors.background},
          styles.tabBar,
          {
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom,
          },
        ],
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Timers',
          tabBarIcon: ({ color, size }) => (
            <Clock size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'New Timer',
          tabBarIcon: ({ color, size }) => (
            <PlusCircle size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => (
            <History size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    elevation: 0,
    shadowOpacity: 0,
  },
  tabBarLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
});
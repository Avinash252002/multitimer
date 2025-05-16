// src/utils/getSystemTheme.ts
import { Appearance } from 'react-native';

export const getSystemTheme = () => {
  const colorScheme = Appearance.getColorScheme(); // 'light' | 'dark' | null
  return colorScheme ?? 'light'; // fallback to light
};

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Timer, TimerLog } from '../types';

// Storage Keys
const TIMERS_STORAGE_KEY = '@TimerApp:timers';
const TIMER_LOGS_STORAGE_KEY = '@TimerApp:timerLogs';
const CATEGORIES_STORAGE_KEY = '@TimerApp:categories';

// Timer Storage
export const saveTimers = async (timers: Timer[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(TIMERS_STORAGE_KEY, JSON.stringify(timers));
  } catch (error) {
    console.error('Error saving timers:', error);
  }
};

export const getTimers = async (): Promise<Timer[]> => {
  try {
    const timersJson = await AsyncStorage.getItem(TIMERS_STORAGE_KEY);
    return timersJson ? JSON.parse(timersJson) : [];
  } catch (error) {
    console.error('Error loading timers:', error);
    return [];
  }
};

// Timer Logs Storage
export const saveTimerLogs = async (logs: TimerLog[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(TIMER_LOGS_STORAGE_KEY, JSON.stringify(logs));
  } catch (error) {
    console.error('Error saving timer logs:', error);
  }
};

export const getTimerLogs = async (): Promise<TimerLog[]> => {
  try {
    const logsJson = await AsyncStorage.getItem(TIMER_LOGS_STORAGE_KEY);
    return logsJson ? JSON.parse(logsJson) : [];
  } catch (error) {
    console.error('Error loading timer logs:', error);
    return [];
  }
};

// Categories Storage
export const saveCategories = async (categories: string[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error('Error saving categories:', error);
  }
};

export const getCategories = async (): Promise<string[]> => {
  try {
    const categoriesJson = await AsyncStorage.getItem(CATEGORIES_STORAGE_KEY);
    return categoriesJson ? JSON.parse(categoriesJson) : ['Work', 'Personal', 'Fitness']; // Default categories
  } catch (error) {
    console.error('Error loading categories:', error);
    return ['Work', 'Personal', 'Fitness']; // Default categories
  }
};

// Clear all data (for testing or reset feature)
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      TIMERS_STORAGE_KEY,
      TIMER_LOGS_STORAGE_KEY,
      CATEGORIES_STORAGE_KEY,
    ]);
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};
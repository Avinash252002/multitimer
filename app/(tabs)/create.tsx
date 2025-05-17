import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import TimerForm from '@/components/TimerForm';
import { useTimers } from '@/context/TimerContext';
import { Timer } from '@/types';

export default function CreateTimerScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { categories, addCategory, addTimer } = useTimers();

  const handleCreateTimer = (timer: Timer) => {
    addTimer(timer);
    // Navigate back to timers tab
    router.push('/');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Create New Timer</Text>
      </View>

      <TimerForm
        categories={categories}
        onAddCategory={addCategory}
        onCreateTimer={handleCreateTimer}
      />

      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#333',
  },
});
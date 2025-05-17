// screens/TimerScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Modal, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';

import { loadTimers, tickTimer , removeTimer } from '../../redux/slices/timerSlice';
import AddTimerForm from '../../components/AddTimerForm';
import CategorySection from '../../components/CategorySection';
import { useAppSelector } from '@/redux/hooks';
import { AppDispatch } from '@/redux/store';
import { Timer } from '@/redux/slices/timerSlice';

export default function TimerScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const timers = useAppSelector(state => state.timers.timers);
  const [completedTimer, setCompletedTimer] = useState<Timer | null>(null);

  useEffect(() => {
    const load = async () => {
      const saved = await AsyncStorage.getItem('timers');
      if (saved) dispatch(loadTimers(JSON.parse(saved)));
    };
    load();
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      timers.forEach(timer => {
        if (timer.status === 'Running') {
          dispatch(tickTimer(timer.id));
          if (timer.remaining === 1) {
            setCompletedTimer(timer);

          }
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timers, dispatch]);

  const grouped = timers.reduce<Record<string, Timer[]>>((acc, timer) => {
    if (!acc[timer.category]) acc[timer.category] = [];
    acc[timer.category].push(timer);
    return acc;
  }, {});

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AddTimerForm />
      {Object.entries(grouped).map(([category, timers]) => (
        <CategorySection key={category} category={category} timers={timers} />
      ))}
      <Modal visible={!!completedTimer} transparent animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.modalText}>🎉 {completedTimer?.name} Completed!</Text>
          <Button title="Close" onPress={() => setCompletedTimer(null)} />
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalText: {
    fontSize: 24,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
});

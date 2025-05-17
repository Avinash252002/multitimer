import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Play, Pause, RotateCcw, CircleCheck as CheckCircle } from 'lucide-react-native';
import { Timer } from '@/types';
import { formatTime, calculateProgress, getStatusColor } from '@/utils/timerUtils';
import ProgressBar from './ProgressBar';

interface TimerCardProps {
  timer: Timer;
  onStart: (id: string) => void;
  onPause: (id: string) => void;
  onReset: (id: string) => void;
  onShowCompletionModal: (timer: Timer) => void;
  onHalfwayAlert: (timer: Timer) => void;
}

const TimerCard: React.FC<TimerCardProps> = ({
  timer,
  onStart,
  onPause,
  onReset,
  onShowCompletionModal,
  onHalfwayAlert,
}) => {
  const [progress, setProgress] = useState(calculateProgress(timer));
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    setProgress(calculateProgress(timer));
    
    // Check for halfway point if alert is enabled and timer is running
    if (
      timer.hasHalfwayAlert && 
      timer.status === 'running' && 
      !timer.halfwayAlertTriggered && 
      timer.remainingTime <= timer.duration / 2
    ) {
      onHalfwayAlert(timer);
    }

    // Animation when timer completes
    if (timer.status === 'completed') {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Show completion modal
      onShowCompletionModal(timer);
    }
  }, [timer]);

  const handleStart = () => onStart(timer.id);
  const handlePause = () => onPause(timer.id);
  const handleReset = () => onReset(timer.id);

  const statusColor = getStatusColor(timer.status);

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          borderLeftColor: statusColor,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.name}>{timer.name}</Text>
        <Text style={styles.category}>{timer.category}</Text>
      </View>
      
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>
          {formatTime(timer.remainingTime)}
        </Text>
        <Text style={styles.totalTime}>
          / {formatTime(timer.duration)}
        </Text>
      </View>
      
      <ProgressBar progress={progress} color={statusColor} />
      
      <View style={styles.controlsContainer}>
        {timer.status === 'running' ? (
          <TouchableOpacity style={styles.controlButton} onPress={handlePause}>
            <Pause size={20} color="#666" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={handleStart}
            disabled={timer.status === 'completed'}
          >
            <Play size={20} color={timer.status === 'completed' ? '#aaa' : '#666'} />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.controlButton} onPress={handleReset}>
          <RotateCcw size={20} color="#666" />
        </TouchableOpacity>
        
        {timer.status === 'completed' && (
          <View style={styles.completedIcon}>
            <CheckCircle size={20} color="#9c27b0" />
          </View>
        )}
      </View>
      
      {timer.hasHalfwayAlert && (
        <View style={styles.alertBadge}>
          <Text style={styles.alertText}>Alert @ 50%</Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderLeftWidth: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  category: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  timeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#333',
  },
  totalTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#999',
    marginLeft: 4,
  },
  controlsContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  controlButton: {
    padding: 8,
    marginRight: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  completedIcon: {
    marginLeft: 'auto',
    padding: 4,
  },
  alertBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  alertText: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: '#F57C00',
  },
});

export default TimerCard;
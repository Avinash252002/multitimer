import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { ChevronDown, ChevronRight, Play, Pause, RotateCcw } from 'lucide-react-native';
import { Timer } from '@/types';
import TimerCard from './TimerCard';

interface CategoryGroupProps {
  category: string;
  timers: Timer[];
  isExpanded: boolean;
  onToggleExpand: (category: string) => void;
  onStartAll: (category: string) => void;
  onPauseAll: (category: string) => void;
  onResetAll: (category: string) => void;
  onStart: (id: string) => void;
  onPause: (id: string) => void;
  onReset: (id: string) => void;
  onShowCompletionModal: (timer: Timer) => void;
  onHalfwayAlert: (timer: Timer) => void;
}

const CategoryGroup: React.FC<CategoryGroupProps> = ({
  category,
  timers,
  isExpanded,
  onToggleExpand,
  onStartAll,
  onPauseAll,
  onResetAll,
  onStart,
  onPause,
  onReset,
  onShowCompletionModal,
  onHalfwayAlert,
}) => {
  const heightAnim = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;
  const rotateAnim = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(heightAnim, {
        toValue: isExpanded ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(rotateAnim, {
        toValue: isExpanded ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isExpanded]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  const maxHeight = heightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1000], // This should be enough for most cases
  });

  const activeTimers = timers.filter(t => t.status === 'running' || t.status === 'paused');
  const completedTimers = timers.filter(t => t.status === 'completed');
  const hasActiveTimers = activeTimers.length > 0;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => onToggleExpand(category)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <Animated.View style={{ transform: [{ rotate }] }}>
            <ChevronRight size={20} color="#666" />
          </Animated.View>
          <Text style={styles.categoryTitle}>{category}</Text>
          <View style={styles.timerCountContainer}>
            <Text style={styles.timerCount}>{timers.length}</Text>
          </View>
        </View>

        {hasActiveTimers && (
          <View style={styles.indicators}>
            <View style={styles.activeIndicator} />
            <Text style={styles.indicatorText}>{activeTimers.length} active</Text>
          </View>
        )}
      </TouchableOpacity>

      <Animated.View style={[styles.content, { maxHeight }]}>
        {timers.length > 0 ? (
          <>
            <View style={styles.bulkActions}>
              <TouchableOpacity
                style={styles.bulkAction}
                onPress={() => onStartAll(category)}
              >
                <Play size={16} color="#4caf50" />
                <Text style={styles.bulkActionText}>Start All</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.bulkAction}
                onPress={() => onPauseAll(category)}
              >
                <Pause size={16} color="#ff9800" />
                <Text style={styles.bulkActionText}>Pause All</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.bulkAction}
                onPress={() => onResetAll(category)}
              >
                <RotateCcw size={16} color="#f44336" />
                <Text style={styles.bulkActionText}>Reset All</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.timerList}>
              {timers.map((timer) => (
                <TimerCard
                  key={timer.id}
                  timer={timer}
                  onStart={onStart}
                  onPause={onPause}
                  onReset={onReset}
                  onShowCompletionModal={onShowCompletionModal}
                  onHalfwayAlert={onHalfwayAlert}
                />
              ))}
            </View>
          </>
        ) : (
          <Text style={styles.emptyMessage}>No timers in this category</Text>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    marginLeft: 8,
    color: '#333',
  },
  timerCountContainer: {
    backgroundColor: '#E8E4F3', // Light purple
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  timerCount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#6A5ACD', // Purple
  },
  content: {
    overflow: 'hidden',
  },
  timerList: {
    padding: 16,
    paddingTop: 0,
  },
  emptyMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    padding: 16,
  },
  bulkActions: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  bulkAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    padding: 6,
  },
  bulkActionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginLeft: 4,
    color: '#666',
  },
  indicators: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4caf50', // Green
    marginRight: 4,
  },
  indicatorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
  },
});

export default CategoryGroup;
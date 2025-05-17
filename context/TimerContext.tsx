import React, { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import { Timer, TimerLog } from '@/types';
import { saveTimers, getTimers, saveTimerLogs, getTimerLogs, saveCategories, getCategories } from '@/utils/storage';

interface TimerState {
  timers: Timer[];
  timerLogs: TimerLog[];
  categories: string[];
  expandedCategories: string[];
}

type TimerAction =
  | { type: 'INITIALIZE'; payload: { timers: Timer[]; timerLogs: TimerLog[]; categories: string[] } }
  | { type: 'ADD_TIMER'; payload: Timer }
  | { type: 'START_TIMER'; payload: string }
  | { type: 'PAUSE_TIMER'; payload: string }
  | { type: 'RESET_TIMER'; payload: string }
  | { type: 'UPDATE_TIMER'; payload: Timer }
  | { type: 'COMPLETE_TIMER'; payload: { timerId: string; log: TimerLog } }
  | { type: 'UPDATE_REMAINING_TIME'; payload: { id: string; remainingTime: number } }
  | { type: 'ADD_CATEGORY'; payload: string }
  | { type: 'TOGGLE_CATEGORY_EXPAND'; payload: string }
  | { type: 'START_ALL_CATEGORY'; payload: string }
  | { type: 'PAUSE_ALL_CATEGORY'; payload: string }
  | { type: 'RESET_ALL_CATEGORY'; payload: string }
  | { type: 'MARK_HALFWAY_TRIGGERED'; payload: string };

interface TimerContextType extends TimerState {
  addTimer: (timer: Timer) => void;
  startTimer: (id: string) => void;
  pauseTimer: (id: string) => void;
  resetTimer: (id: string) => void;
  addCategory: (category: string) => void;
  toggleCategoryExpand: (category: string) => void;
  startAllTimersInCategory: (category: string) => void;
  pauseAllTimersInCategory: (category: string) => void;
  resetAllTimersInCategory: (category: string) => void;
  markHalfwayTriggered: (id: string) => void;
}

const initialState: TimerState = {
  timers: [],
  timerLogs: [],
  categories: ['Work', 'Personal', 'Fitness'],
  expandedCategories: [],
};

const timerReducer = (state: TimerState, action: TimerAction): TimerState => {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        ...state,
        timers: action.payload.timers,
        timerLogs: action.payload.timerLogs,
        categories: action.payload.categories,
        expandedCategories: action.payload.categories.slice(0, 2), // Expand first two categories by default
      };
      
    case 'ADD_TIMER':
      return {
        ...state,
        timers: [...state.timers, action.payload],
        expandedCategories: state.expandedCategories.includes(action.payload.category)
          ? state.expandedCategories
          : [...state.expandedCategories, action.payload.category],
      };
      
    case 'START_TIMER':
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.id === action.payload
            ? { ...timer, status: 'running' }
            : timer
        ),
      };
      
    case 'PAUSE_TIMER':
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.id === action.payload
            ? { ...timer, status: 'paused' }
            : timer
        ),
      };
      
    case 'RESET_TIMER':
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.id === action.payload
            ? { ...timer, status: 'idle', remainingTime: timer.duration, halfwayAlertTriggered: false }
            : timer
        ),
      };
      
    case 'UPDATE_TIMER':
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.id === action.payload.id ? action.payload : timer
        ),
      };
      
    case 'COMPLETE_TIMER':
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.id === action.payload.timerId
            ? { ...timer, status: 'completed', remainingTime: 0 }
            : timer
        ),
        timerLogs: [...state.timerLogs, action.payload.log],
      };
      
    case 'UPDATE_REMAINING_TIME':
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.id === action.payload.id
            ? {
                ...timer,
                remainingTime: action.payload.remainingTime,
              }
            : timer
        ),
      };
      
    case 'ADD_CATEGORY':
      if (state.categories.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        categories: [...state.categories, action.payload],
        expandedCategories: [...state.expandedCategories, action.payload],
      };
      
    case 'TOGGLE_CATEGORY_EXPAND':
      return {
        ...state,
        expandedCategories: state.expandedCategories.includes(action.payload)
          ? state.expandedCategories.filter((cat) => cat !== action.payload)
          : [...state.expandedCategories, action.payload],
      };
      
    case 'START_ALL_CATEGORY':
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.category === action.payload && timer.status !== 'completed'
            ? { ...timer, status: 'running' }
            : timer
        ),
      };
      
    case 'PAUSE_ALL_CATEGORY':
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.category === action.payload && timer.status === 'running'
            ? { ...timer, status: 'paused' }
            : timer
        ),
      };
      
    case 'RESET_ALL_CATEGORY':
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.category === action.payload
            ? { ...timer, status: 'idle', remainingTime: timer.duration, halfwayAlertTriggered: false }
            : timer
        ),
      };
      
    case 'MARK_HALFWAY_TRIGGERED':
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.id === action.payload
            ? { ...timer, halfwayAlertTriggered: true }
            : timer
        ),
      };

    default:
      return state;
  }
};

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(timerReducer, initialState);
  const intervalRefs = useRef<Record<string, NodeJS.Timeout>>({});

  // Load data from storage on initial render
  useEffect(() => {
    const loadData = async () => {
      const timers = await getTimers();
      const timerLogs = await getTimerLogs();
      const categories = await getCategories();
      
      dispatch({
        type: 'INITIALIZE',
        payload: { timers, timerLogs, categories },
      });
    };
    
    loadData();
  }, []);

  // Save timers to storage whenever they change
  useEffect(() => {
    if (state.timers.length > 0) {
      saveTimers(state.timers);
    }
  }, [state.timers]);

  // Save timer logs to storage whenever they change
  useEffect(() => {
    if (state.timerLogs.length > 0) {
      saveTimerLogs(state.timerLogs);
    }
  }, [state.timerLogs]);

  // Save categories to storage whenever they change
  useEffect(() => {
    if (state.categories.length > 0) {
      saveCategories(state.categories);
    }
  }, [state.categories]);

  // Timer update effect
  useEffect(() => {
    // Clear all intervals first
    Object.values(intervalRefs.current).forEach((interval) => clearInterval(interval));
    intervalRefs.current = {};

    // Start new intervals for running timers
    state.timers.forEach((timer) => {
      if (timer.status === 'running') {
        intervalRefs.current[timer.id] = setInterval(() => {
          const newRemainingTime = Math.max(0, timer.remainingTime - 1);
          
          if (newRemainingTime === 0) {
            // If timer is complete, clear interval and complete timer
            clearInterval(intervalRefs.current[timer.id]);
            delete intervalRefs.current[timer.id];
            
            const timerLog: TimerLog = {
              id: Date.now().toString(),
              timerId: timer.id,
              name: timer.name,
              category: timer.category,
              duration: timer.duration,
              completedAt: Date.now(),
            };
            
            dispatch({
              type: 'COMPLETE_TIMER',
              payload: { timerId: timer.id, log: timerLog },
            });
          } else {
            // Otherwise, just update the remaining time
            dispatch({
              type: 'UPDATE_REMAINING_TIME',
              payload: { id: timer.id, remainingTime: newRemainingTime },
            });
          }
        }, 1000);
      }
    });

    // Clean up intervals on unmount
    return () => {
      Object.values(intervalRefs.current).forEach((interval) => clearInterval(interval));
    };
  }, [state.timers]);

  // Actions
  const addTimer = (timer: Timer) => {
    dispatch({ type: 'ADD_TIMER', payload: timer });
  };

  const startTimer = (id: string) => {
    dispatch({ type: 'START_TIMER', payload: id });
  };

  const pauseTimer = (id: string) => {
    dispatch({ type: 'PAUSE_TIMER', payload: id });
  };

  const resetTimer = (id: string) => {
    dispatch({ type: 'RESET_TIMER', payload: id });
  };

  const addCategory = (category: string) => {
    dispatch({ type: 'ADD_CATEGORY', payload: category });
  };

  const toggleCategoryExpand = (category: string) => {
    dispatch({ type: 'TOGGLE_CATEGORY_EXPAND', payload: category });
  };

  const startAllTimersInCategory = (category: string) => {
    dispatch({ type: 'START_ALL_CATEGORY', payload: category });
  };

  const pauseAllTimersInCategory = (category: string) => {
    dispatch({ type: 'PAUSE_ALL_CATEGORY', payload: category });
  };

  const resetAllTimersInCategory = (category: string) => {
    dispatch({ type: 'RESET_ALL_CATEGORY', payload: category });
  };

  const markHalfwayTriggered = (id: string) => {
    dispatch({ type: 'MARK_HALFWAY_TRIGGERED', payload: id });
  };

  return (
    <TimerContext.Provider
      value={{
        ...state,
        addTimer,
        startTimer,
        pauseTimer,
        resetTimer,
        addCategory,
        toggleCategoryExpand,
        startAllTimersInCategory,
        pauseAllTimersInCategory,
        resetAllTimersInCategory,
        markHalfwayTriggered,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimers = () => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimers must be used within a TimerProvider');
  }
  return context;
};
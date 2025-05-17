export interface Timer {
  id: string;
  name: string;
  duration: number; // in seconds
  category: string;
  status: 'idle' | 'running' | 'paused' | 'completed';
  remainingTime: number; // in seconds
  createdAt: number; // timestamp
  hasHalfwayAlert: boolean;
  halfwayAlertTriggered?: boolean;
}

export interface TimerLog {
  id: string;
  timerId: string;
  name: string;
  category: string;
  duration: number;
  completedAt: number; // timestamp
}

export interface Category {
  name: string;
  isExpanded: boolean;
}

export type TimeFormatType = 'compact' | 'full';
import { Timer, TimeFormatType } from '../types';

// Format time in seconds to mm:ss or hh:mm:ss
export const formatTime = (timeInSeconds: number, format: TimeFormatType = 'compact'): string => {
  if (timeInSeconds < 0) timeInSeconds = 0;

  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = Math.floor(timeInSeconds % 60);

  // For compact format, only show hours if they exist
  if (format === 'compact') {
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Full format always shows hours
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// Calculate progress percentage for a timer
export const calculateProgress = (timer: Timer): number => {
  const { duration, remainingTime } = timer;
  if (duration <= 0) return 0;
  
  const progress = ((duration - remainingTime) / duration) * 100;
  return Math.min(Math.max(progress, 0), 100); // Ensure progress is between 0 and 100
};

// Get appropriate status text
export const getStatusText = (status: Timer['status']): string => {
  switch (status) {
    case 'running':
      return 'Running';
    case 'paused':
      return 'Paused';
    case 'completed':
      return 'Completed';
    case 'idle':
    default:
      return 'Ready';
  }
};

// Generate a unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

// Get status color
export const getStatusColor = (status: Timer['status']): string => {
  switch (status) {
    case 'running':
      return '#4caf50'; // Green
    case 'paused':
      return '#ff9800'; // Orange
    case 'completed':
      return '#9c27b0'; // Purple
    case 'idle':
    default:
      return '#2196f3'; // Blue
  }
};

// Get text for the "time ago" display
export const timeAgo = (timestamp: number): string => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + ' years ago';
  }
  
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + ' months ago';
  }
  
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + ' days ago';
  }
  
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + ' hours ago';
  }
  
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + ' minutes ago';
  }
  
  return Math.floor(seconds) + ' seconds ago';
};
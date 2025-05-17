import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Plus, Clock } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface EmptyStateProps {
  type: 'timers' | 'history';
}

const EmptyState: React.FC<EmptyStateProps> = ({ type }) => {
  const router = useRouter();

  const navigateToCreate = () => {
    router.push('/create');
  };

  if (type === 'timers') {
    return (
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Clock size={64} color="#ddd" />
        </View>
        <Text style={styles.title}>No Timers Yet</Text>
        <Text style={styles.description}>
          Create your first timer to start tracking your time effectively
        </Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={navigateToCreate}
        >
          <Plus size={18} color="white" />
          <Text style={styles.buttonText}>Create Timer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Clock size={64} color="#ddd" />
      </View>
      <Text style={styles.title}>No Timer History</Text>
      <Text style={styles.description}>
        Complete your first timer to see it in the history
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 16,
    opacity: 0.7,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#6A5ACD',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: 'white',
    marginLeft: 8,
  },
});

export default EmptyState;
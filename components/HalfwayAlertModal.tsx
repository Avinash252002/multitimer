import React, { useEffect, useRef } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Dimensions 
} from 'react-native';
import { BellRing, X } from 'lucide-react-native';
import { Timer } from '@/types';

interface HalfwayAlertModalProps {
  visible: boolean;
  timer: Timer | null;
  onClose: () => void;
}

const HalfwayAlertModal: React.FC<HalfwayAlertModalProps> = ({
  visible,
  timer,
  onClose,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset animations
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  if (!timer) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <Animated.View 
          style={[
            styles.modalView, 
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            }
          ]}
        >
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={20} color="#666" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.iconContainer}>
            <BellRing size={40} color="#FF9800" />
          </View>
          
          <Text style={styles.alertTitle}>Halfway Point!</Text>
          <Text style={styles.timerName}>{timer.name}</Text>
          <Text style={styles.message}>
            You're halfway through your timer for {timer.category}.
          </Text>
          
          <TouchableOpacity style={styles.continueButton} onPress={onClose}>
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');
const modalWidth = Math.min(width * 0.8, 320);

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: modalWidth,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  closeButton: {
    padding: 4,
  },
  iconContainer: {
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    padding: 16,
    borderRadius: 40,
  },
  alertTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  timerName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#FF9800',
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  continueButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
  },
  continueButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: 'white',
  },
});

export default HalfwayAlertModal;
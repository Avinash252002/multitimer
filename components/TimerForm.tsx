import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Switch,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { generateId } from '@/utils/timerUtils';
import { Timer } from '@/types';
import { ChevronDown, Plus, Clock, Tag } from 'lucide-react-native';

interface TimerFormProps {
  categories: string[];
  onAddCategory: (category: string) => void;
  onCreateTimer: (timer: Timer) => void;
}

const TimerForm: React.FC<TimerFormProps> = ({
  categories,
  onAddCategory,
  onCreateTimer,
}) => {
  const [name, setName] = useState('');
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('0');
  const [seconds, setSeconds] = useState('0');
  const [category, setCategory] = useState(categories[0] || '');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [hasHalfwayAlert, setHasHalfwayAlert] = useState(false);

  const calculateTotalSeconds = (): number => {
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;
    return h * 3600 + m * 60 + s;
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      // Highlight the name field as required
      return;
    }

    const totalSeconds = calculateTotalSeconds();
    if (totalSeconds <= 0) {
      // Highlight the time fields as required
      return;
    }

    if (!category) {
      // Highlight the category field as required
      return;
    }

    const newTimer: Timer = {
      id: generateId(),
      name: name.trim(),
      duration: totalSeconds,
      remainingTime: totalSeconds,
      category,
      status: 'idle',
      createdAt: Date.now(),
      hasHalfwayAlert,
    };

    onCreateTimer(newTimer);

    // Reset form
    setName('');
    setHours('0');
    setMinutes('0');
    setSeconds('0');
    setHasHalfwayAlert(false);
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      onAddCategory(newCategory.trim());
      setCategory(newCategory.trim());
      setNewCategory('');
    }
    setShowCategoryDropdown(false);
  };

  const selectCategory = (selectedCategory: string) => {
    setCategory(selectedCategory);
    setShowCategoryDropdown(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidView}
    >
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formGroup}>
          <Text style={styles.label}>Timer Name</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter timer name"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Duration</Text>
          <View style={styles.timeContainer}>
            <View style={styles.timeInputWrapper}>
              <Text style={styles.timeLabel}>Hours</Text>
              <TextInput
                style={styles.timeInput}
                value={hours}
                onChangeText={setHours}
                keyboardType="number-pad"
                maxLength={2}
              />
            </View>
            <Text style={styles.timeSeparator}>:</Text>
            <View style={styles.timeInputWrapper}>
              <Text style={styles.timeLabel}>Minutes</Text>
              <TextInput
                style={styles.timeInput}
                value={minutes}
                onChangeText={(text) => {
                  // Ensure minutes are between 0-59
                  const mins = parseInt(text);
                  if (isNaN(mins)) {
                    setMinutes('');
                  } else if (mins >= 0 && mins <= 59) {
                    setMinutes(mins.toString());
                  }
                }}
                keyboardType="number-pad"
                maxLength={2}
              />
            </View>
            <Text style={styles.timeSeparator}>:</Text>
            <View style={styles.timeInputWrapper}>
              <Text style={styles.timeLabel}>Seconds</Text>
              <TextInput
                style={styles.timeInput}
                value={seconds}
                onChangeText={(text) => {
                  // Ensure seconds are between.1
                  //                    //between 0-59
                  const secs = parseInt(text);
                  if (isNaN(secs)) {
                    setSeconds('');
                  } else if (secs >= 0 && secs <= 59) {
                    setSeconds(secs.toString());
                  }
                }}
                keyboardType="number-pad"
                maxLength={2}
              />
            </View>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Category</Text>
          <TouchableOpacity
            style={styles.categorySelector}
            onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
          >
            <View style={styles.categoryValue}>
              <Tag size={16} color="#666" />
              <Text style={styles.categoryText}>
                {category || 'Select a category'}
              </Text>
            </View>
            <ChevronDown size={18} color="#666" />
          </TouchableOpacity>

          {showCategoryDropdown && (
            <View style={styles.dropdownContainer}>
              <ScrollView 
                style={styles.categoriesList}
                nestedScrollEnabled={true}
              >
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={styles.categoryItem}
                    onPress={() => selectCategory(cat)}
                  >
                    <Text style={[
                      styles.categoryItemText,
                      cat === category && styles.selectedCategoryText,
                    ]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.addCategoryContainer}>
                <TextInput
                  style={styles.addCategoryInput}
                  value={newCategory}
                  onChangeText={setNewCategory}
                  placeholder="Add new category"
                  placeholderTextColor="#999"
                />
                <TouchableOpacity 
                  style={styles.addCategoryButton}
                  onPress={handleAddCategory}
                  disabled={!newCategory.trim()}
                >
                  <Plus size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <View style={styles.formGroup}>
          <View style={styles.switchRow}>
            <View style={styles.switchLabelContainer}>
              <Clock size={18} color="#666" />
              <Text style={styles.switchLabel}>Halfway Alert</Text>
            </View>
            <Switch
              value={hasHalfwayAlert}
              onValueChange={setHasHalfwayAlert}
              trackColor={{ false: '#EAEAEA', true: '#BDB4F0' }}
              thumbColor={hasHalfwayAlert ? '#6A5ACD' : '#F4F3F4'}
              ios_backgroundColor="#EAEAEA"
            />
          </View>
          <Text style={styles.switchDescription}>
            Get an alert when the timer reaches its halfway point.
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.createButton}
          onPress={handleSubmit}
        >
          <Text style={styles.createButtonText}>Create Timer</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  inputWrapper: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    justifyContent: 'center',
  },
  input: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInputWrapper: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
  },
  timeLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  timeInput: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
  timeSeparator: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#666',
    marginHorizontal: 8,
  },
  categorySelector: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  dropdownContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    maxHeight: 200,
  },
  categoriesList: {
    maxHeight: 150,
  },
  categoryItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  categoryItemText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#333',
  },
  selectedCategoryText: {
    color: '#6A5ACD',
    fontFamily: 'Inter-SemiBold',
  },
  addCategoryContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
    paddingTop: 8,
    marginTop: 8,
  },
  addCategoryInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    marginRight: 8,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  addCategoryButton: {
    backgroundColor: '#6A5ACD',
    borderRadius: 8,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  switchLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  switchDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
  },
  createButton: {
    backgroundColor: '#6A5ACD',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  createButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: 'white',
  },
});

export default TimerForm;
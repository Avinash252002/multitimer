import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import { addTimer } from '../redux/slices/timerSlice';
import { useAppSelector } from '@/redux/hooks';


export default function AddTimerForm() {
  const dispatch = useDispatch();
  const timers = useAppSelector(state => state.timers.timers);

  const categories = Array.from(new Set(timers.map(t => t.category)));

  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('');
  const [useCustomCategory, setUseCustomCategory] = useState(false);

  const handleAdd = () => {
    if (!name || !duration || !category) return;
    dispatch(addTimer({ name, duration: Number(duration), category }));
    setName('');
    setDuration('');
    setCategory('');
    setUseCustomCategory(false);
  };

  return (
    <View style={styles.form}>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Duration (s)"
        keyboardType="numeric"
        value={duration}
        onChangeText={setDuration}
        style={styles.input}
      />
      
      {!useCustomCategory && (
        <>
          <Text style={styles.label}>Select Category</Text>
          <View style={styles.dropdown}>
            {categories.map(cat => (
              <Text
                key={cat}
                style={[
                  styles.dropdownItem,
                  category === cat && styles.selectedItem,
                ]}
                onPress={() => setCategory(cat)}
              >
                {cat}
              </Text>
            ))}
            <Text style={styles.addNew} onPress={() => setUseCustomCategory(true)}>
              + Add new category
            </Text>
          </View>
        </>
      )}

      {useCustomCategory && (
        <TextInput
          placeholder="New Category"
          value={category}
          onChangeText={setCategory}
          style={styles.input}
        />
      )}

      <Button title="Add Timer" onPress={handleAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    borderRadius: 5,
  },
  label: {
    marginBottom: 5,
    fontWeight: '600',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
  },
  dropdownItem: {
    paddingVertical: 6,
    color: '#007AFF',
  },
  selectedItem: {
    fontWeight: 'bold',
  },
  addNew: {
    paddingVertical: 6,
    color: '#FF6F00',
  },
});

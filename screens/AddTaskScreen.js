import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { addTask } from '../redux/taskActions';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const COLORS = {
  light: {
    primary: '#6200ee',
    secondary: '#03dac6',
    background: '#f9f9f9',
    cardBackground: '#ffffff',
    text: '#000000',
    muted: '#888888',
    white: '#ffffff',
  },
  dark: {
    primary: '#bb86fc',
    secondary: '#03dac6',
    background: '#121212',
    cardBackground: '#1e1e1e',
    text: '#ffffff',
    muted: '#aaaaaa',
    white: '#ffffff',
  },
};

const SPACING = { s: 8, m: 16, l: 24 };
const RADIUS = { m: 8 };
const SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 4,
};
const TEXT_VARIANTS = {
  body: { fontSize: 16, fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System' },
  button: { fontSize: 16, fontWeight: '600', fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System' },
};

const AddTaskScreen = ({ navigation, isDarkMode = false }) => {
  const theme = isDarkMode ? COLORS.dark : COLORS.light;
  const dispatch = useDispatch();
  const scale = useRef(new Animated.Value(1)).current;

  const [taskTitle, setTaskTitle] = useState('');
  const [category, setCategory] = useState('Work');
  const [priority, setPriority] = useState('Low');
  const [dueDate, setDueDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const categories = ['Work', 'Personal', 'Urgent'];
  const priorities = ['Low', 'Medium', 'High'];

  const handleAddTask = () => {
    if (taskTitle.trim() === '') {
      Alert.alert('Error', 'Task title cannot be empty');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    Animated.sequence([
      Animated.timing(scale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      const newTask = {
        id: Date.now().toString(),
        title: taskTitle,
        category,
        priority,
        dueDate: dueDate.toISOString(),
        notes,
        completed: false,
        createdAt: new Date().toISOString(),
      };

      dispatch(addTask(newTask));
      setTaskTitle('');
      setNotes('');
      navigation.goBack();
    });
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (event.type === 'set' && selectedDate) {
      setDueDate(selectedDate);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <TextInput
          style={[styles.input, { backgroundColor: theme.cardBackground, color: theme.text }]}
          placeholder="Task title"
          placeholderTextColor={theme.muted}
          value={taskTitle}
          onChangeText={setTaskTitle}
        />

        <Picker
          selectedValue={category}
          onValueChange={setCategory}
          style={[styles.picker, { backgroundColor: theme.cardBackground, color: theme.text }]}
          dropdownIconColor={theme.text}
        >
          {categories.map((cat) => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>

        <Picker
          selectedValue={priority}
          onValueChange={setPriority}
          style={[styles.picker, { backgroundColor: theme.cardBackground, color: theme.text }]}
          dropdownIconColor={theme.text}
        >
          {priorities.map((pri) => (
            <Picker.Item key={pri} label={pri} value={pri} />
          ))}
        </Picker>

        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ marginBottom: SPACING.m }}>
          <Text style={[styles.dateText, { color: theme.primary }]}>
            Select Due Date: {dueDate.toDateString()}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={dueDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={handleDateChange}
          />
        )}

        <TextInput
          style={[styles.input, styles.notesInput, { backgroundColor: theme.cardBackground, color: theme.text }]}
          placeholder="Notes"
          placeholderTextColor={theme.muted}
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        <Animated.View style={{ transform: [{ scale }] }}>
          <TouchableOpacity onPress={handleAddTask} activeOpacity={0.8}>
            <LinearGradient colors={[theme.primary, theme.secondary]} style={styles.addButton}>
              <Icon name="add" size={24} color={theme.white} />
              <Text style={[styles.buttonText, { color: theme.white }]}>Add Task</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.m,
  },
  input: {
    ...TEXT_VARIANTS.body,
    borderRadius: RADIUS.m,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    ...SHADOW,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  picker: {
    ...TEXT_VARIANTS.body,
    borderRadius: RADIUS.m,
    marginBottom: SPACING.m,
    ...SHADOW,
  },
  dateText: {
    ...TEXT_VARIANTS.body,
    marginBottom: SPACING.m,
    textAlign: 'left',
  },
  addButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.m,
    borderRadius: RADIUS.m,
    gap: SPACING.s,
    ...SHADOW,
  },
  buttonText: {
    ...TEXT_VARIANTS.button,
    marginLeft: SPACING.s,
  },
});

export default AddTaskScreen;
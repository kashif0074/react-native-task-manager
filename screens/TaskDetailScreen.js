import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateTask } from '../redux/taskActions';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';

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
  label: { fontSize: 20, fontWeight: 'bold', fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System' },
};

const TaskDetailScreen = ({ route, navigation, isDarkMode }) => {
  const theme = isDarkMode ? COLORS.dark : COLORS.light;
  const taskId = route?.params?.taskId;
  const dispatch = useDispatch();
  const [showDatePicker, setShowDatePicker] = useState(false);

  if (!taskId) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.label, { color: theme.text }]}>Error: No task selected.</Text>
      </View>
    );
  }

  const task = useSelector((state) => state.tasks.tasks.find((t) => t.id === taskId));

  if (!task) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.label, { color: theme.text }]}>Task not found.</Text>
      </View>
    );
  }

  const [title, setTitle] = useState(task.title);
  const [category, setCategory] = useState(task.category || 'Work');
  const [priority, setPriority] = useState(task.priority || 'Low');
  const [dueDate, setDueDate] = useState(new Date(task.dueDate || Date.now()));
  const [notes, setNotes] = useState(task.notes || '');

  const categories = ['Work', 'Personal', 'Urgent'];
  const priorities = ['Low', 'Medium', 'High'];

  const handleUpdate = () => {
    if (title.trim() === '') {
      Alert.alert('Error', 'Task title cannot be empty');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    dispatch(
      updateTask(taskId, {
        title,
        category,
        priority,
        dueDate: dueDate.toISOString(),
        notes,
      })
    );
    navigation.goBack();
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (event.type === 'set' && selectedDate) {
      setDueDate(selectedDate);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.label, { color: theme.text }]}>Edit Task</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.cardBackground, color: theme.text }]}
        value={title}
        onChangeText={setTitle}
        placeholder="Task title"
        placeholderTextColor={theme.muted}
      />
      <Picker
        style={[styles.picker, { backgroundColor: theme.cardBackground, color: theme.text }]}
        selectedValue={category}
        onValueChange={setCategory}
        dropdownIconColor={theme.text}
      >
        {categories.map((cat) => (
          <Picker.Item key={cat} label={cat} value={cat} />
        ))}
      </Picker>
      <Picker
        style={[styles.picker, { backgroundColor: theme.cardBackground, color: theme.text }]}
        selectedValue={priority}
        onValueChange={setPriority}
        dropdownIconColor={theme.text}
      >
        {priorities.map((pri) => (
          <Picker.Item key={pri} label={pri} value={pri} />
        ))}
      </Picker>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ marginBottom: SPACING.m }}>
        <Text style={[styles.dateText, { color: theme.primary }]}>
          Select Due Date: {moment(dueDate).format('MMM DD, YYYY')}
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
        value={notes}
        onChangeText={setNotes}
        placeholder="Notes"
        placeholderTextColor={theme.muted}
        multiline
      />
      <TouchableOpacity onPress={handleUpdate} activeOpacity={0.8}>
        <LinearGradient
          colors={[theme.primary, theme.secondary]}
          style={styles.updateButton}
        >
          <Text style={[styles.buttonText, { color: theme.white }]}>Update Task</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.m,
    justifyContent: 'center',
  },
  label: {
    ...TEXT_VARIANTS.label,
    marginBottom: SPACING.m,
  },
  input: {
    ...TEXT_VARIANTS.body,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    borderRadius: RADIUS.m,
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
  updateButton: {
    padding: SPACING.m,
    borderRadius: RADIUS.m,
    alignItems: 'center',
    ...SHADOW,
  },
  buttonText: {
    ...TEXT_VARIANTS.button,
  },
});

export default TaskDetailScreen;
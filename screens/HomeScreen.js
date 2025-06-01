import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Animated,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { deleteTask, completeTask } from '../redux/taskActions';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
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
    success: '#4caf50',
    error: '#f44336',
    priorityHigh: '#f44336',
    priorityMedium: '#ff9800',
    priorityLow: '#4caf50',
    white: '#ffffff',
  },
  dark: {
    primary: '#bb86fc',
    secondary: '#03dac6',
    background: '#121212',
    cardBackground: '#1e1e1e',
    text: '#ffffff',
    muted: '#aaaaaa',
    success: '#66bb6a',
    error: '#ef5350',
    priorityHigh: '#ef5350',
    priorityMedium: '#ffa726',
    priorityLow: '#66bb6a',
    white: '#ffffff',
  },
};

const SPACING = { s: 8, m: 16, l: 24 };
const RADIUS = { s: 4, m: 8 };
const SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 4,
};
const TEXT_VARIANTS = {
  header: { fontSize: 28, fontWeight: 'bold' },
  body: { fontSize: 16 },
  subheader: { fontSize: 14 },
};

const HomeScreen = ({ navigation, isDarkMode }) => {
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const tasks = useSelector((state) => state.tasks?.tasks || []);
  const dispatch = useDispatch();

  const animatedValues = useMemo(() => {
    const obj = {};
    tasks.forEach((task) => {
      obj[task.id] = new Animated.Value(1);
    });
    return obj;
  }, [tasks]);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');

  const categories = useMemo(() => {
    const unique = new Set(tasks.map((task) => task.category));
    return ['All', ...Array.from(unique).filter(Boolean)];
  }, [tasks]);

  let filteredTasks = tasks
    .filter(
      (task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (categoryFilter === 'All' || task.category === categoryFilter)
    )
    .sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'dueDate') return new Date(a.dueDate) - new Date(b.dueDate);
      if (sortBy === 'priority') {
        const priorities = { High: 3, Medium: 2, Low: 1 };
        return priorities[b.priority] - priorities[a.priority];
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const PLACEHOLDER_COUNT = Math.max(0, 5 - filteredTasks.length);
  const placeholders = Array.from({ length: PLACEHOLDER_COUNT }, (_, i) => ({
    id: `placeholder-${i}`,
    title: 'No Task',
    dueDate: new Date(),
    category: '',
    priority: 'Low',
    completed: true,
    placeholder: true,
  }));
  filteredTasks = [...filteredTasks, ...placeholders];

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;

  const handleDelete = (id) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => dispatch(deleteTask(id)),
      },
    ]);
  };

  const handleComplete = (id) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    dispatch(completeTask(id));
  };

  const handleCardPress = (id, scale) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => navigation.navigate('Task Detail', { taskId: id }));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.primary }]}>Task Manager</Text>

      <Text style={[styles.statsText, { color: theme.text }]}>
        Total: {totalTasks} | Completed: {completedTasks} | {completionRate}% Done
      </Text>

      <TextInput
        style={[styles.searchInput, { backgroundColor: theme.cardBackground, color: theme.text }]}
        placeholder="Search tasks..."
        placeholderTextColor={theme.muted}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.filterContainer}>
        <Picker
          style={[styles.picker, { backgroundColor: theme.cardBackground, color: theme.text }]}
          selectedValue={categoryFilter}
          onValueChange={setCategoryFilter}
          dropdownIconColor={theme.text}
        >
          {categories.map((cat) => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>

        <Picker
          style={[styles.picker, { backgroundColor: theme.cardBackground, color: theme.text }]}
          selectedValue={sortBy}
          onValueChange={setSortBy}
          dropdownIconColor={theme.text}
        >
          <Picker.Item label="Sort by Date" value="createdAt" />
          <Picker.Item label="Sort by Title" value="title" />
          <Picker.Item label="Sort by Due Date" value="dueDate" />
          <Picker.Item label="Sort by Priority" value="priority" />
        </Picker>
      </View>

      <FlatList
        data={filteredTasks}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const scale = animatedValues[item.id] || new Animated.Value(1);
          return (
            <Animated.View style={{ transform: [{ scale }] }}>
              <TouchableOpacity
                style={[styles.taskCard, { backgroundColor: theme.cardBackground }]}
                disabled={item.placeholder}
                onPress={() => !item.placeholder && handleCardPress(item.id, scale)}
              >
                <View style={styles.taskInfo}>
                  <Text
                    style={[
                      styles.taskText,
                      { color: theme.text },
                      item.completed && styles.completedText,
                    ]}
                  >
                    {item.title}
                  </Text>
                  {!item.placeholder && (
                    <>
                      <Text style={[styles.subText, { color: theme.muted }]}>
                        Due: {moment(item.dueDate).format('MMM DD, YYYY')}
                      </Text>
                      <Text style={[styles.subText, { color: theme.muted }]}>
                        Category: {item.category} | Priority: {item.priority}
                      </Text>
                      <View
                        style={[
                          styles.priorityIndicator,
                          {
                            backgroundColor:
                              theme[`priority${item.priority}`] || theme.priorityLow,
                          },
                        ]}
                      />
                    </>
                  )}
                </View>

                {!item.placeholder && (
                  <View style={styles.actions}>
                    <TouchableOpacity style={styles.iconButton} onPress={() => handleComplete(item.id)}>
                      <Icon
                        name={item.completed ? 'refresh-circle' : 'checkmark-circle'}
                        size={24}
                        color={theme.success}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.iconButton} onPress={() => handleDelete(item.id)}>
                      <Icon name="trash" size={24} color={theme.error} />
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          );
        }}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          navigation.navigate('Add Task');
        }}
      >
        <LinearGradient colors={[theme.primary, theme.secondary]} style={styles.addButtonGradient}>
          <Icon name="add" size={28} color={theme.white} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: SPACING.m },
  title: { ...TEXT_VARIANTS.header, marginBottom: SPACING.m },
  statsText: { ...TEXT_VARIANTS.body, marginBottom: SPACING.m },
  searchInput: {
    ...TEXT_VARIANTS.body,
    padding: SPACING.m,
    borderRadius: RADIUS.m,
    marginBottom: SPACING.m,
    ...SHADOW,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.m,
  },
  picker: {
    flex: 1,
    borderRadius: RADIUS.m,
    ...SHADOW,
    marginHorizontal: SPACING.s,
    height: 60,
  },
  taskCard: {
    borderRadius: RADIUS.m,
    padding: SPACING.m,
    marginBottom: SPACING.s,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOW,
  },
  taskInfo: { flex: 1, paddingRight: SPACING.m },
  taskText: { ...TEXT_VARIANTS.body },
  subText: { ...TEXT_VARIANTS.subheader },
  completedText: { textDecorationLine: 'line-through', opacity: 0.6 },
  actions: { flexDirection: 'row' },
  iconButton: { marginLeft: SPACING.s },
  addButton: { position: 'absolute', bottom: 30, right: 30 },
  addButtonGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOW,
  },
  priorityIndicator: {
    width: 10,
    height: 10,
    borderRadius: RADIUS.s,
    position: 'absolute',
    right: SPACING.m,
    top: SPACING.m,
  },
  listContent: { paddingBottom: 100 },
});

export default HomeScreen;

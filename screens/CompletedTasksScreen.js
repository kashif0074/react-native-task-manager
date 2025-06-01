import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import { completeTask } from '../redux/taskActions';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import moment from 'moment';

const COLORS = {
  light: {
    background: '#f9f9f9',
    cardBackground: '#ffffff',
    text: '#000000',
    muted: '#888888',
    primary: '#6200ee',
    priorityHigh: '#f44336',
    priorityMedium: '#ff9800',
    priorityLow: '#4caf50',
    success: '#4caf50',
  },
  dark: {
    background: '#121212',
    cardBackground: '#1e1e1e',
    text: '#ffffff',
    muted: '#aaaaaa',
    primary: '#bb86fc',
    priorityHigh: '#ef5350',
    priorityMedium: '#ffa726',
    priorityLow: '#66bb6a',
    success: '#66bb6a',
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
  header: { fontSize: 24, fontWeight: 'bold', fontFamily: 'Roboto-Bold' },
  body: { fontSize: 18, fontFamily: 'Roboto-Regular' },
  subheader: { fontSize: 14, fontFamily: 'Roboto-Regular' },
};

const CompletedTasksScreen = ({ isDarkMode, navigation }) => {
  const theme = isDarkMode ? COLORS.dark : COLORS.light;
  const dispatch = useDispatch();
  const completedTasks = useSelector((state) =>
    (state.tasks?.tasks ?? []).filter((task) => task.completed)
  );
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('completedAt');
  const animatedValues = completedTasks.reduce((acc, task) => {
    acc[task.id] = new Animated.Value(1);
    return acc;
  }, {});
  const categories = ['All', 'Work', 'Personal', 'Urgent'];

  const filteredTasks = completedTasks
    .filter(
      (task) => categoryFilter === 'All' || task.category === categoryFilter
    )
    .sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'dueDate') return new Date(a.dueDate) - new Date(b.dueDate);
      if (sortBy === 'priority') {
        const priorities = { High: 3, Medium: 2, Low: 1 };
        return priorities[b.priority] - priorities[a.priority];
      }
      return new Date(b.completedAt || b.createdAt) - new Date(a.completedAt || a.createdAt);
    });

  const handleComplete = (id, scale) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => dispatch(completeTask(id)));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Completed Tasks</Text>
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
          <Picker.Item label="Sort by Completion" value="completedAt" />
          <Picker.Item label="Sort by Title" value="title" />
          <Picker.Item label="Sort by Due Date" value="dueDate" />
          <Picker.Item label="Sort by Priority" value="priority" />
        </Picker>
      </View>
      {filteredTasks.length === 0 ? (
        <Text style={[styles.noTasksText, { color: theme.text }]}>No completed tasks yet.</Text>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Animated.View style={{ transform: [{ scale: animatedValues[item.id] || new Animated.Value(1) }] }}>
              <TouchableOpacity
                style={[styles.taskCard, { backgroundColor: theme.cardBackground }]}
                onPress={() => navigation.navigate('Task Detail', { taskId: item.id })}
              >
                <View style={styles.taskInfo}>
                  <Text style={[styles.taskText, { color: theme.text }]}>{item.title}</Text>
                  <Text style={[styles.subText, { color: theme.muted }]}>
                    Due: {moment(item.dueDate).format('MMM DD, YYYY')}
                  </Text>
                  <Text style={[styles.subText, { color: theme.muted }]}>
                    Category: {item.category} | Priority: {item.priority}
                  </Text>
                  <View style={[styles.priorityIndicator, { backgroundColor: theme[`priority${item.priority}`] }]} />
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => handleComplete(item.id, animatedValues[item.id])}
                  >
                    <Icon name="refresh-circle" size={24} color={theme.success} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.m,
  },
  title: {
    ...TEXT_VARIANTS.header,
    marginBottom: SPACING.m,
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
  },
  noTasksText: {
    ...TEXT_VARIANTS.body,
    fontStyle: 'italic',
  },
  taskCard: {
    padding: SPACING.m,
    marginBottom: SPACING.s,
    borderRadius: RADIUS.m,
    ...SHADOW,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskInfo: {
    flex: 1,
  },
  taskText: {
    ...TEXT_VARIANTS.body,
  },
  subText: {
    ...TEXT_VARIANTS.subheader,
  },
  priorityIndicator: {
    width: 10,
    height: 10,
    borderRadius: RADIUS.m / 2,
    position: 'absolute',
    right: SPACING.m,
    top: SPACING.m,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.s,
  },
  iconButton: {
    marginLeft: SPACING.s,
  },
});

export default CompletedTasksScreen;
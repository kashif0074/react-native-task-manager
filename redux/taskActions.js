import AsyncStorage from '@react-native-async-storage/async-storage';

// Action Types
export const LOAD_TASKS = 'LOAD_TASKS';
export const ADD_TASK = 'ADD_TASK';
export const DELETE_TASK = 'DELETE_TASK';
export const COMPLETE_TASK = 'COMPLETE_TASK';
export const UPDATE_TASK = 'UPDATE_TASK';

// Load tasks from AsyncStorage
export const loadTasks = () => async (dispatch) => {
  try {
    const tasks = JSON.parse(await AsyncStorage.getItem('tasks')) || [];
    dispatch({ type: LOAD_TASKS, payload: tasks });
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
};

export const addTask = (task) => async (dispatch, getState) => {
  try {
    dispatch({ type: ADD_TASK, payload: task });
    const { tasks } = getState().tasks;
    await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Error adding task:', error);
  }
};

export const deleteTask = (taskId) => async (dispatch, getState) => {
  try {
    dispatch({ type: DELETE_TASK, payload: taskId });
    const { tasks } = getState().tasks;
    await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};

export const completeTask = (taskId) => async (dispatch, getState) => {
  try {
    dispatch({ type: COMPLETE_TASK, payload: taskId });
    const { tasks } = getState().tasks;
    await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Error completing task:', error);
  }
};

export const updateTask = (taskId, updates) => async (dispatch, getState) => {
  try {
    dispatch({ type: UPDATE_TASK, payload: { id: taskId, updates } });
    const { tasks } = getState().tasks;
    await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Error updating task:', error);
  }
};

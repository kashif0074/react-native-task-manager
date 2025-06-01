import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './taskReducer';
import { loadTasks } from './taskActions';

const store = configureStore({
  reducer: {
    tasks: taskReducer,
  },
});

// Dispatch loadTasks after store is ready
store.dispatch(loadTasks());

export default store;

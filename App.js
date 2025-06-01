// App.js
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Provider } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import store from './redux/store';
import HomeScreen from './screens/HomeScreen';
import AddTaskScreen from './screens/AddTaskScreen';
import TaskDetailScreen from './screens/TaskDetailScreen';
import CompletedTasksScreen from './screens/CompletedTasksScreen';
import PendingTasksScreen from './screens/PendingTasksScreen';
import SplashScreen from './screens/SplashScreen';
import AboutScreen from './screens/AboutScreen';

const Drawer = createDrawerNavigator();

const COLORS = {
  primary: '#6200ee',
  secondary: '#03dac6',
  background: '#f9f9f9',
  cardBackground: '#ffffff',
  text: '#000000',
  muted: '#888888',
  white: '#ffffff',
};

const TEXT_VARIANTS = {
  header: { fontSize: 28, fontWeight: 'bold', fontFamily: 'Roboto-Bold' },
  body: { fontSize: 16, fontFamily: 'Roboto-Regular' },
};

const CustomDrawerContent = ({ navigation }) => {
  const drawerItems = [
    { name: 'Home', icon: 'home-outline' },
    { name: 'Completed Tasks', icon: 'checkmark-done-outline' },
    { name: 'Pending Tasks', icon: 'time-outline' },
    { name: 'About', icon: 'information-circle-outline' },
  ];

  return (
    <View style={[styles.drawerContainer, { backgroundColor: COLORS.cardBackground }]}>
      <LinearGradient colors={[COLORS.primary, COLORS.secondary]} style={styles.drawerHeader}>
        <Text style={[styles.drawerHeaderText, { color: COLORS.white }]}>Task Manager</Text>
      </LinearGradient>
      {drawerItems.map((item) => (
        <TouchableOpacity
          key={item.name}
          style={styles.drawerItem}
          onPress={() => navigation.navigate(item.name)}
        >
          <Icon name={item.icon} size={22} color={COLORS.text} />
          <Text style={[styles.drawerItemText, { color: COLORS.text }]}>{item.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const MainNavigator = () => {
  const isDarkMode = false;
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        header: ({ navigation }) => (
          <LinearGradient colors={[COLORS.primary, COLORS.secondary]} style={styles.header}>
            <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
              <Icon name="menu" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={[styles.headerText, { color: COLORS.white }]}>Task Manager</Text>
          </LinearGradient>
        ),
        drawerStyle: { backgroundColor: COLORS.cardBackground },
        drawerActiveTintColor: COLORS.primary,
        drawerLabelStyle: TEXT_VARIANTS.body,
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Add Task" component={AddTaskScreen} options={{ drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="Task Detail">
        {(props) => <TaskDetailScreen {...props} isDarkMode={isDarkMode} />}
      </Drawer.Screen>
      <Drawer.Screen name="Completed Tasks" component={CompletedTasksScreen} />
      <Drawer.Screen name="Pending Tasks" component={PendingTasksScreen} />
      <Drawer.Screen name="About" component={AboutScreen} />
    </Drawer.Navigator>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer theme={DefaultTheme}>
        {isLoading ? <SplashScreen /> : <MainNavigator />}
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 40,
  },
  headerText: {
    ...TEXT_VARIANTS.header,
    marginLeft: 16,
  },
  drawerContainer: {
    flex: 1,
  },
  drawerHeader: {
    padding: 20,
    paddingTop: 40,
  },
  drawerHeaderText: {
    ...TEXT_VARIANTS.header,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  drawerItemText: {
    ...TEXT_VARIANTS.body,
    marginLeft: 16,
  },
});
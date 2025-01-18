import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create Context
const TodoContext = createContext();

// Custom Hook to use the Todo Context
export const useTodoContext = () => useContext(TodoContext);

// Provider Component
export const TodoProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);

  const addTask = (task) => {
    const newTasks = [...tasks, task];
    setTasks(newTasks);
    AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
  };

  const toggleTaskCompletion = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );

    // Sort tasks immediately after completion toggle (completed tasks at the bottom)
    updatedTasks.sort((a, b) => a.completed - b.completed);

    setTasks(updatedTasks);
    AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  // Update `editTask` to handle both title and description
  const editTask = (taskId, newTitle, newDescription, dueDate) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, title: newTitle, description: newDescription, dueDate: dueDate } : task
    );
    setTasks(updatedTasks);
    AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks)); // Save the updated tasks
  };

  const filterTasks = (status) => {
    let filteredTasks;
    if (status === 'All') {
      filteredTasks = tasks;
    } else if (status === 'Completed') {
      filteredTasks = tasks.filter((task) => task.completed);
    } else if (status === 'Pending') {
      filteredTasks = tasks.filter((task) => !task.completed);
    }

    // Sort the filtered tasks, ensuring completed tasks are at the bottom
    filteredTasks.sort((a, b) => a.completed - b.completed);

    setTasks(filteredTasks);
  };

  const sortTasks = (criteria) => {
    let sortedTasks;
    if (criteria === 'title') {
      sortedTasks = [...tasks].sort((a, b) => a.title.localeCompare(b.title));
    } else if (criteria === 'dueDate') {
      sortedTasks = [...tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (criteria === 'createdAt') {
      sortedTasks = [...tasks].sort((a, b) => a.id - b.id);
    }

    // After sorting by the chosen criteria, make sure completed tasks are at the bottom
    sortedTasks.sort((a, b) => a.completed - b.completed);

    setTasks(sortedTasks);
  };

  return (
    <TodoContext.Provider value={{ user, setUser, tasks, addTask, toggleTaskCompletion, deleteTask, editTask, filterTasks, sortTasks }}>
      {children}
    </TodoContext.Provider>
  );
};

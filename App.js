import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TodoProvider, useTodoContext } from './components/TodoContext';
import TaskList from './components/TaskList';
import LoginScreen from './components/LoginScreen';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import RNPickerSelect from 'react-native-picker-select'; // Import the dropdown component
import Ionicons from 'react-native-vector-icons/Ionicons'; // For the arrow icon



function App() {
  const { user, setUser, tasks, addTask, toggleTaskCompletion, deleteTask, sortTasks, editTask } = useTodoContext();
  const [taskText, setTaskText] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [searchText, setSearchText] = useState(''); // Search text
  const [loggedIn, setLoggedIn] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [dueDate, setDueDate] = useState(false);
  const [date, setDate] = useState(new Date()); // Default to current date
  const [isVisible, setIsVisible] = useState(false); // Controls visibility of the modal
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedSort, setSelectedSort] = useState('title');
  
   // Filter options
   const filterOptions = [
    { label: 'All', value: 'All' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Pending', value: 'Pending' },
  ];

  // Sort options
  const sortOptions = [
    { label: 'Sort by Title', value: 'title' },
    { label: 'Sort by Due Date', value: 'dueDate' },
    { label: 'Sort by Created', value: 'createdAt' },
  ];

  const handleFilterChange = (value) => {
    setSelectedFilter(value);
    filterTasks(value);
  };

  const handleSortChange = (value) => {
    setSelectedSort(value);
    sortTasks(value);
  };

   // Show the date picker modal
   const showDatePicker = () => {
    setIsVisible(true);
  };
  // Hide the date picker modal
  const hideDatePicker = () => {
    setIsVisible(false);
  };

  // Handle date selection
  const handleConfirm = (selectedDate) => {
    setDueDate(selectedDate); // Update the date state with the selected date
    hideDatePicker(); // Close the modal
  };

  useEffect(() => {
    // Check if user is logged in
    AsyncStorage.getItem('user').then((userData) => {
      if (userData) {
        setUser(JSON.parse(userData));
        setLoggedIn(true);
      }
    });
  }, [setUser]);

  useEffect(() => {
    setFilteredTasks(tasks); // Reset filter when tasks are updated
  }, [tasks]);

  useEffect(() => {
    // Filter tasks based on search text
    if (searchText === '') {
      setFilteredTasks(tasks); // If no search text, show all tasks
    } else {
      const filtered = tasks.filter((task) =>
        task.title.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredTasks(filtered); // Set filtered tasks based on search
    }
  }, [searchText, tasks]);

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    setUser(null);
    setLoggedIn(false);
  };

  const handleAddTask = () => {
    if (taskText.trim() === '') return; // Prevent adding empty tasks
    const newTask = { id: Date.now(), title: taskText, description: taskDesc, completed: false, dueDate: dueDate };
    addTask(newTask); // Add task using context function
    setTaskDesc('');
    setTaskText('');
    setDueDate(false); // Clear input after adding
  };

  // Filter tasks based on status (All, Completed, Pending)
  const filterTasks = (status) => {
    let filtered = [];
    if (status === 'All') {
      filtered = tasks;
    } else if (status === 'Completed') {
      filtered = tasks.filter((task) => task.completed);
    } else if (status === 'Pending') {
      filtered = tasks.filter((task) => !task.completed);
    }
    
    // Sort the filtered tasks, ensuring completed tasks are at the bottom
    filtered.sort((a, b) => a.completed - b.completed);
    
    setFilteredTasks(filtered); // Update the filteredTasks state
  };

  if (!loggedIn) {
    return <LoginScreen setLoggedIn={setLoggedIn} />;
  }

  const minDate = new Date();
  minDate.setMinutes(minDate.getMinutes() - 1);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>To-Do App</Text>

      {/* Search Bar with Icon */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search tasks..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="gray"
        />
      </View>

      <View style={styles.addTaskContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your task"
          value={taskText}
          onChangeText={setTaskText}
          placeholderTextColor="gray"
        />
      </View>

      <View style={styles.addDescriptionContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your description"
          value={taskDesc}
          onChangeText={setTaskDesc}
          placeholderTextColor="gray"
        />
      </View>

      <View style={styles.container_cal}>
        <TouchableOpacity onPress={showDatePicker} style={styles.inputBox_cal}>
          {dueDate ? 
            <Text style={styles.text_cal}>{moment(dueDate).format('MMMM Do YYYY, h:mm A')}</Text> :
            <Text style={styles.text_cal}>Enter due date</Text>
          }
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isVisible} // Controls visibility of the modal
          mode="datetime" // Can be 'date' or 'time'
          date={date} // Pass the current date
          onConfirm={handleConfirm} // Handle date selection
          onCancel={hideDatePicker} // Handle cancellation
          minimumDate={minDate} // Optional: set minimum date
          maximumDate={new Date(2025, 11, 31)} // Optional: set maximum date
          headerTextIOS="Pick due date" // iOS-specific header text
        />
      </View>

      {/* Add Task Button */}
      <TouchableOpacity style={styles.addTaskButton} onPress={handleAddTask}>
        <Text style={styles.addTaskButtonText}>Add Task</Text>
      </TouchableOpacity>

      {/* Filter Buttons
      <View style={styles.filterSortContainer}>
        <TouchableOpacity style={styles.filterSortButton} onPress={() => filterTasks('All')}>
          <Text style={styles.filterSortText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterSortButton} onPress={() => filterTasks('Completed')}>
          <Text style={styles.filterSortText}>Completed</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterSortButton} onPress={() => filterTasks('Pending')}>
          <Text style={styles.filterSortText}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterSortButton} onPress={() => sortTasks('title')}>
          <Text style={styles.filterSortText}>Sort by Title</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterSortButton} onPress={() => sortTasks('dueDate')}>
          <Text style={styles.filterSortText}>Sort by Due Date</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterSortButton} onPress={() => sortTasks('createdAt')}>
          <Text style={styles.filterSortText}>Sort by Created</Text>
        </TouchableOpacity>
      </View> */}

      <View style={styles.container_drop}>
        {/* Filter Dropdown */}
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>Filter</Text>
          <RNPickerSelect
            onValueChange={handleFilterChange}
            items={filterOptions}
            value={selectedFilter}
            style={pickerSelectStyles}
            useNativeAndroidPickerStyle={false} // To allow custom styling for Android
            Icon={() => (
              <Ionicons name="chevron-down" size={20} color="gray" style={styles.icon} />
            )}
          />
        </View>

        {/* Sort Dropdown */}
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>Sort</Text>
          <RNPickerSelect
            onValueChange={handleSortChange}
            items={sortOptions}
            value={selectedSort}
            style={pickerSelectStyles}
            useNativeAndroidPickerStyle={false} // To allow custom styling for Android
            Icon={() => (
              <Ionicons name="chevron-down" size={20} color="gray" style={styles.icon} />
            )}
          />
        </View>
      </View>

      {/* Task List - No need for ScrollView since TaskList should already handle it */}
      <TaskList
        tasks={filteredTasks}  /* Display the filtered tasks */
        toggleTaskCompletion={toggleTaskCompletion}
        deleteTask={deleteTask}
        editTask={editTask}  // Keep editTask functionality
      />

      {/* Logout Button moved to bottom */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    color: 'black',
    paddingLeft: 30, // Space for the icon
    fontSize: 16,
  },
  inputAndroid: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    color: 'black',
    paddingLeft: 30, // Space for the icon
    fontSize: 16,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20, // Adjust this value to bring the search bar down
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    paddingBottom: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'grey',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    color: 'white',
  },
  addTaskContainer: {
    marginBottom: 5,
  },
  addDescriptionContainer: {
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'grey',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    color: 'white',
    marginBottom: 20,
  },
  addTaskButton: {
    backgroundColor: 'blue',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  addTaskButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  filterSortContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },
  filterSortButton: {
    backgroundColor: 'gray',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginBottom: 10,
  },
  filterSortText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: 'purple',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 'auto', // Push it to the bottom
    marginBottom: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container_cal: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0, // Adjust this value to bring the search bar down
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    paddingBottom: 5,
  },
  inputBox_cal: {
    flex: 1,
    height: 40,
    borderColor: 'grey',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    color: 'white',
  },
  text_cal: {
    color: 'grey',
    fontSize: 14,
  },
  container_drop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dropdownContainer: {
    flexDirection: 'column',
    width: '45%',
  },
  dropdownLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: 'black',
  },
  icon: {
    position: 'absolute',
    right: 10,
    top: 12,
  },
});

export default function AppWithProvider() {
  return (
    <TodoProvider>
      <App />
    </TodoProvider>
  );
}

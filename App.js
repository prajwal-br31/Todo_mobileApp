import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TodoProvider, useTodoContext } from './components/TodoContext';
import TaskList from './components/TaskList';
import LoginScreen from './components/LoginScreen';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import RNPickerSelect from 'react-native-picker-select';
import Ionicons from 'react-native-vector-icons/Ionicons';



function App() {
  const { user, setUser, tasks, addTask, toggleTaskCompletion, deleteTask, sortTasks, editTask } = useTodoContext();
  const [taskText, setTaskText] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [searchText, setSearchText] = useState(''); 
  const [loggedIn, setLoggedIn] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [dueDate, setDueDate] = useState(false);
  const [date, setDate] = useState(new Date());
  const [isVisible, setIsVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedSort, setSelectedSort] = useState('');

  console.log('selectedFilter', selectedFilter)
  
 
   const filterOptions = [
    { label: 'All', value: 'All' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Pending', value: 'Pending' },
  ];


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


   const showDatePicker = () => {
    setIsVisible(true);
  };

  const hideDatePicker = () => {
    setIsVisible(false);
  };

  // Handle date selection
  const handleConfirm = (selectedDate) => {
    setDueDate(selectedDate); 
    hideDatePicker();
  };

  useEffect(() => {
    AsyncStorage.getItem('user').then((userData) => {
      if (userData) {
        setUser(JSON.parse(userData));
        setLoggedIn(true);
      }
    });
  }, [setUser]);

  useEffect(() => {
    setFilteredTasks(tasks); 
  }, [tasks]);

  useEffect(() => {
  
    if (searchText === '') {
      setFilteredTasks(tasks); 
    } else {
      const filtered = tasks.filter((task) =>
        task.title.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredTasks(filtered);
    }
  }, [searchText, tasks]);

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    setUser(null);
    setLoggedIn(false);
  };

  const handleAddTask = () => {
    if (taskText.trim() === '') return;
    const newTask = { id: Date.now(), title: taskText, description: taskDesc, completed: false, dueDate: dueDate };
    addTask(newTask);
    setTaskDesc('');
    setTaskText('');
    setDueDate(false); 
  };

  const filterTasks = (status) => {
    let filtered = [];
    if (status === 'All') {
      filtered = tasks;
    } else if (status === 'Completed') {
      filtered = tasks.filter((task) => task.completed);
    } else if (status === 'Pending') {
      filtered = tasks.filter((task) => !task.completed);
    }
    
    filtered.sort((a, b) => a.completed - b.completed);
    
    setFilteredTasks(filtered);
  };

  if (!loggedIn) {
    return <LoginScreen setLoggedIn={setLoggedIn} />;
  }

  const minDate = new Date();
  minDate.setMinutes(minDate.getMinutes() - 1);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>To-Do App</Text>

      <View style={styles.searchContainer}>
      <Ionicons name="search" size={20} color="white" style={styles.searchIcon} />
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
          isVisible={isVisible} 
          mode="datetime" 
          date={date}
          onConfirm={handleConfirm} 
          onCancel={hideDatePicker} 
          minimumDate={minDate} 
          maximumDate={new Date(2025, 11, 31)} 
          headerTextIOS="Pick due date" 
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
            useNativeAndroidPickerStyle={false}
            Icon={() => (
              <Ionicons name="chevron-down" size={20} style={styles.icon} />

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
            useNativeAndroidPickerStyle={false} 
            Icon={() => (
              <Ionicons name="chevron-down" size={20} color="gray" style={styles.icon} />
            )}
          />
        </View>
      </View>

      {/* Task List */}
      <TaskList
        tasks={filteredTasks} 
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
    marginTop: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    paddingBottom: 5,
    width: '90%',
    alignSelf: 'center',
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
    width: '90%',
    alignSelf: 'center',
  },
  addDescriptionContainer: {
    marginBottom: 5,
    width: '90%',
    alignSelf: 'center',

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
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 5,
  },
  addTaskButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
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
    borderRadius: 25, 
    justifyContent: 'center',
    marginBottom: 20,
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, 
    shadowRadius: 5, 
    padding: 10,
    alignItems: 'center',
    marginTop: 'auto',
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
    alignSelf: 'center',
    marginTop: 0,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    paddingBottom: 5,
    width: '90%',
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

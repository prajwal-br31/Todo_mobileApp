import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';


const TaskItem = ({ task, toggleTaskCompletion, deleteTask, editTask }) => {
  const [isEditing, setIsEditing] = useState(false); // To toggle between view and edit mode
  const [editedTaskTitle, setEditedTaskTitle] = useState(task.title); // Store the edited title
  const [editedTaskDescription, setEditedTaskDescription] = useState(task.description); 
  const [editedDueDate, setEditDueDate] = useState(task.dueDate);
  const [isVisible, setIsVisible] = useState(false); // Controls visibility of the modal
  const [date, setDate] = useState(new Date()); // Default to current date
  
  
  // Store the edited description
 // Show the date picker modal
   const showDatePicker = () => {
    setIsVisible(true);
  };

  const minDate = new Date();
  minDate.setMinutes(minDate.getMinutes() - 1);

  // Hide the date picker modal
  const hideDatePicker = () => {
    setIsVisible(false);
  };

  // Handle date selection
  const handleConfirm = (selectedDate) => {
    setEditDueDate(selectedDate); // Update the date state with the selected date
    hideDatePicker(); // Close the modal
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    if (editedTaskTitle.trim() && editedTaskDescription.trim()) {
      // Save edited task title and description using the context's editTask function
      editTask(task.id, editedTaskTitle, editedTaskDescription, editedDueDate);
      setIsEditing(false); // Switch back to view mode after saving
    }
  };

  return (
    <View style={styles.taskItem}>
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={task.completed}
          onValueChange={() => toggleTaskCompletion(task.id)}
          style={styles.checkbox}
        />
      </View>

      <View style={styles.textContainer}>
        {/* Title */}
        {isEditing ? (
          <TextInput
            style={[styles.taskText, task.completed && styles.completedTask, styles.titleInput]}
            value={editedTaskTitle}
            onChangeText={setEditedTaskTitle}
          />
        ) : (
          <Text style={[styles.taskText, task.completed && styles.completedTask, styles.title]}>
            {task.title}
          </Text>
        )}

        {isEditing ? (
          <TextInput
            style={[styles.descriptionInput, task.completed && styles.completedTask]}
            value={editedTaskDescription}
            onChangeText={setEditedTaskDescription}
          />
        ) : (
          <Text style={[styles.description, task.completed && styles.completedTask]}>
            {task.description}
          </Text>
        )}

        {isEditing ? (
          <View>
            <TouchableOpacity onPress={showDatePicker}>
                <Text style={styles.text_cal}>{moment(editedDueDate).format('MMMM Do YYYY, h:mm A')}</Text>
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
        ) : (
          <Text style={[styles.description, task.completed && styles.completedTask]}>
          {moment(editedDueDate).format('MMMM Do YYYY, h:mm A')}
          </Text>
          
        )}

        
      </View>

      <View style={styles.buttonsContainer}>
        {/* Edit Button */}
        {!isEditing && (
          <TouchableOpacity onPress={handleEditClick} style={styles.editButton}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
        )}

        {/* Save Button (only visible in edit mode) */}
        {isEditing && (
          <TouchableOpacity onPress={handleSaveClick} style={styles.saveButton}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        )}

        {/* Delete Button */}
        <TouchableOpacity onPress={() => deleteTask(task.id)} style={styles.deleteButton}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  taskItem: {
    flexDirection: 'row', // Align elements horizontally
    alignItems: 'flex-start',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    justifyContent: 'space-between', // Ensure space between text and buttons
  },
  checkboxContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10, // Space between checkbox and text
  },
  textContainer: {
    flex: 1, // Allow the text container to take the remaining space
    paddingLeft: 10, // Space from checkbox
  },
  taskText: {
    color: 'white', // Text color
  },
  title: {
    fontSize: 18, // Title is slightly bigger
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14, // Smaller size for description
    color: 'lightgrey',
    marginTop: 5, // Add space between the title and description
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Align buttons to the right
    alignItems: 'center',
    marginLeft: 10, // Ensure a little space between text and buttons
  },
  editButton: {
    backgroundColor: 'yellow',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: 'green',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkbox: {
    width: 20,      // Smaller width
    height: 20,     // Smaller height
    borderWidth: 2, // Define border thickness
    borderColor: 'gray', // Border color for square shape
    borderRadius: 0, // Ensures it's square
  },
  titleInput: {
    fontSize: 18, // Title is slightly bigger for editing
    fontWeight: 'bold',
    color: 'white',
  },
  descriptionInput: {
    fontSize: 14, // Description size for editing
    color: 'white',
    marginTop: 5,
  },
  text_cal: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,

  },
});

export default TaskItem;

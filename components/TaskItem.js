import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const TaskItem = ({ task, toggleTaskCompletion, deleteTask, editTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTaskTitle, setEditedTaskTitle] = useState(task.title);
  const [editedTaskDescription, setEditedTaskDescription] = useState(task.description);
  const [editedDueDate, setEditDueDate] = useState(task.dueDate);
  const [isVisible, setIsVisible] = useState(false);
  const [date, setDate] = useState(new Date());

  const showDatePicker = () => setIsVisible(true);
  const hideDatePicker = () => setIsVisible(false);
  const handleConfirm = (selectedDate) => {
    setEditDueDate(selectedDate);
    hideDatePicker();
  };
  const handleEditClick = () => setIsEditing(true);
  const handleSaveClick = () => {
    if (editedTaskTitle.trim() && editedTaskDescription.trim()) {
      editTask(task.id, editedTaskTitle, editedTaskDescription, editedDueDate);
      setIsEditing(false);
    }
  };

  const taskStyle = task.completed ? styles.completedTaskContainer : styles.pendingTaskContainer;
  const textStyle = task.completed ? styles.completedText : styles.pendingText;

  return (
    <View style={[styles.taskItem, taskStyle]}>
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={task.completed}
          onValueChange={() => toggleTaskCompletion(task.id)}
          style={styles.checkbox}
        />
      </View>

      <View style={styles.textContainer}>
        {isEditing ? (
          <TextInput
            style={[styles.taskText, textStyle, styles.titleInput]}
            value={editedTaskTitle}
            onChangeText={setEditedTaskTitle}
          />
        ) : (
          <Text style={[styles.taskText, textStyle, styles.title]}>
            {task.title}
          </Text>
        )}

        {isEditing ? (
          <TextInput
            style={[styles.descriptionInput, textStyle]}
            value={editedTaskDescription}
            onChangeText={setEditedTaskDescription}
          />
        ) : (
          <Text style={[styles.description, textStyle]}>
            {task.description}
          </Text>
        )}

        {isEditing ? (
          <TouchableOpacity onPress={showDatePicker}>
            {editedDueDate ?  <Text style={styles.text_cal}>
              {moment(editedDueDate).format('MMMM Do YYYY, h:mm A')}
            </Text>: 
            null}
           
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={showDatePicker} disabled = {true}>
            {editedDueDate ?  <Text style={styles.text_cal}>
              {moment(editedDueDate).format('MMMM Do YYYY, h:mm A')}
            </Text>: 
            null}
           
          </TouchableOpacity>
        )}

        <DateTimePickerModal
          isVisible={isVisible}
          mode="datetime"
          date={date}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          minimumDate={new Date()}
          maximumDate={new Date(2025, 11, 31)}
          headerTextIOS="Pick due date"
        />
      </View>

      <View style={styles.buttonsContainer}>
        {!isEditing && (
          <TouchableOpacity onPress={handleEditClick} style={styles.editButton}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
        )}

        {isEditing && (
          <TouchableOpacity onPress={handleSaveClick} style={styles.saveButton}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => deleteTask(task.id)} style={styles.deleteButton}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  taskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  checkboxContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  taskText: {
    color: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: '#ffcc00',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginRight: 10,
    opacity: 0.8,
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginRight: 10,
    opacity: 0.8,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    opacity: 0.8,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 6,
  },
  titleInput: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 5,
  },
  descriptionInput: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 5,
  },
  text_cal: {
    color: '#fff',
    fontSize: 10,
    marginTop: 5,
  },

  completedTaskContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },

  pendingTaskContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  completedText: {
    color: '#666', 
    textDecorationLine: 'line-through',
  },
  pendingText: {
    color: '#fff',
  },
});

export default TaskItem;

import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';

const TaskForm = ({ onSave, existingTask }) => {
  const [title, setTitle] = useState(existingTask ? existingTask.title : '');
  const [dueDate, setDueDate] = useState(existingTask ? existingTask.dueDate.toString() : '');

  const handleSave = () => {
    if (title && dueDate) {
      const task = { title, dueDate: new Date(dueDate), completed: false };
      onSave(task);
    }
  };

  return (
    <View style={styles.formContainer}>
      <TextInput
        style={styles.input}
        placeholder="Task Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Due Date"
        value={dueDate}
        onChangeText={setDueDate}
      />
      <Button title="Save Task" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default TaskForm;

import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import TaskItem from './TaskItem';  // Correct import

const TaskList = ({ tasks, toggleTaskCompletion, deleteTask, editTask }) => {
  return (
    <View style={styles.taskList}>
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            toggleTaskCompletion={toggleTaskCompletion}
            deleteTask={deleteTask}
            editTask={editTask}  // Pass editTask here
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  taskList: {
    flex: 1,
  },
});

export default TaskList;

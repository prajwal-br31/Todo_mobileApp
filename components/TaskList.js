import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import TaskItem from './TaskItem';  // Assuming TaskItem handles rendering individual tasks

const TaskList = ({ tasks, toggleTaskCompletion, deleteTask, editTask }) => {
  return (
    <View style={styles.taskListContainer}>
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            toggleTaskCompletion={toggleTaskCompletion}
            deleteTask={deleteTask}
            editTask={editTask}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  taskListContainer: {
    flex: 1,
    padding: 10,
    //backgroundColor: '#f4f4f9', // Light gray background
    borderTopLeftRadius: 25, // Rounded corners for the top
    borderTopRightRadius: 25,
    overflow: 'hidden', // Prevents overflow of the corners
  },
  flatListContent: {
    paddingBottom: 20, // Adds some space at the bottom
  },
});

export default TaskList;

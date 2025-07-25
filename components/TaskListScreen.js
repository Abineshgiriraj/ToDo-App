import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Modal, 
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

function TaskListScreen() {
  // State variables
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Load tasks from AsyncStorage on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  // Load tasks from AsyncStorage
  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks !== null) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      Alert.alert('Error', 'Could not load your tasks');
    } finally {
      setLoading(false);
    }
  };

  // Save tasks to AsyncStorage
  const saveTasks = async (updatedTasks) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
      Alert.alert('Error', 'Could not save your tasks');
    }
  };

  // Add a new task
  const addTask = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Title is required');
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate.toISOString(),
      completed: false,
      createdAt: new Date().toISOString()
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    closeModal();
  };

  // Update an existing task
  const updateTask = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Title is required');
      return;
    }

    const updatedTasks = tasks.map(task => {
      if (task.id === currentTask.id) {
        return {
          ...task,
          title: title.trim(),
          description: description.trim(),
          dueDate: dueDate.toISOString()
        };
      }
      return task;
    });

    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    closeModal();
  };

  // Toggle task completion status
  const toggleTaskCompletion = (id) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });

    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  // Delete a task - simplified function without alert
  const deleteTask = (id) => {
    try {
      // Create a new array without the task to delete
      const updatedTasks = tasks.filter(task => task.id !== id);
      // Update state first
      setTasks(updatedTasks);
      // Then save to AsyncStorage
      saveTasks(updatedTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
      Alert.alert('Error', 'Could not delete the task. Please try again.');
    }
  };

  // Open modal to add a new task
  const openAddTaskModal = () => {
    setTitle('');
    setDescription('');
    setDueDate(new Date());
    setEditMode(false);
    setCurrentTask(null);
    setModalVisible(true);
  };

  // Open modal to edit an existing task
  const openEditTaskModal = (task) => {
    setTitle(task.title);
    setDescription(task.description || '');
    setDueDate(new Date(task.dueDate));
    setEditMode(true);
    setCurrentTask(task);
    setModalVisible(true);
  };

  // Close the modal and reset form
  const closeModal = () => {
    setModalVisible(false);
    setTitle('');
    setDescription('');
    setDueDate(new Date());
    setEditMode(false);
    setCurrentTask(null);
  };

  // Handle date change
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };


  // Render each task item
  const renderItem = ({ item }) => (
    <View style={[styles.taskItem, item.completed && styles.completedTask]}>
      <TouchableOpacity 
        style={styles.checkboxContainer}
        onPress={() => toggleTaskCompletion(item.id)}
      >
        <View style={[styles.checkbox, item.completed && styles.checkboxChecked]}>
          {item.completed && <Ionicons name="checkmark" size={16} color="white" />}
        </View>
      </TouchableOpacity>
      
      <View style={styles.taskContent}>
        <Text style={[styles.taskTitle, item.completed && styles.completedTaskText]}>
          {item.title}
        </Text>
        
        {item.description ? (
          <Text style={[styles.taskDescription, item.completed && styles.completedTaskText]}>
            {item.description}
          </Text>
        ) : null}
        
        <Text style={styles.taskDate}>
          Due: {formatDate(item.dueDate)}
        </Text>
      </View>
      
      <View style={styles.taskActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => openEditTaskModal(item)}
        >
          <Ionicons name="pencil" size={18} color="#4a90e2" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#ffeeee', borderRadius: 20 }]}
          onPress={() => deleteTask(item.id)}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Ionicons name="trash" size={22} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Empty list component
  const EmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="list" size={64} color="#ccc" />
      <Text style={styles.emptyText}>No tasks yet</Text>
      <Text style={styles.emptySubText}>Tap the + button to add a new task</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>My Tasks</Text>
      </View>

      {/* Task List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a90e2" />
          <Text style={styles.loadingText}>Loading tasks...</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.list}
          contentContainerStyle={tasks.length === 0 ? { flex: 1 } : null}
          ListEmptyComponent={EmptyListComponent}
        />
      )}

      {/* Add Task Button (FAB) */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={openAddTaskModal}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      {/* Add/Edit Task Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editMode ? 'Edit Task' : 'Add New Task'}
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer}>
              {/* Title Input */}
              <Text style={styles.inputLabel}>Title *</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Task title"
                maxLength={100}
              />

              {/* Description Input */}
              <Text style={styles.inputLabel}>Description (optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Task description"
                multiline={true}
                numberOfLines={4}
                maxLength={500}
              />

              {/* Due Date Picker */}
              <Text style={styles.inputLabel}>Due Date</Text>
              <TouchableOpacity 
                style={styles.datePickerButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateText}>{formatDate(dueDate.toISOString())}</Text>
                <Ionicons name="calendar" size={20} color="#4a90e2" />
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={dueDate}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                  minimumDate={new Date()}
                />
              )}

              {/* Submit Button */}
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={editMode ? updateTask : addTask}
              >
                <Text style={styles.submitButtonText}>
                  {editMode ? 'Update Task' : 'Add Task'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#4a90e2',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  list: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  taskItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
  },
  completedTask: {
    backgroundColor: '#f8f8f8',
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4a90e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4a90e2',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  taskDate: {
    fontSize: 12,
    color: '#888',
  },
  taskActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    padding: 10,
    marginLeft: 10,
    borderRadius: 20,
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#4a90e2',
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TaskListScreen;
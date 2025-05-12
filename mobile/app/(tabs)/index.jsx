import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  ActivityIndicator,
  TextInput,
  Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from "../../constants/api";

const waterOptions = [
  { id: 1, label: '100 ml', icon: 'glass-whiskey', amount: 100 },
  { id: 2, label: '200 ml', icon: 'coffee', amount: 200 },
  { id: 3, label: '250 ml', icon: 'glass-martini-alt', amount: 250 },
  { id: 4, label: '600 ml', icon: 'wine-bottle', amount: 600 },
  { id: 5, label: 'Custom', icon: 'edit', amount: 'custom' },
];

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Home() {
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [todayData, setTodayData] = useState({
    goal_ml: 2000,
    consumed_ml: 0,
    goal_achieved: false
  });
  const [weeklyCompletion, setWeeklyCompletion] = useState(Array(7).fill(false));
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Target editing state
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [newTarget, setNewTarget] = useState('');
  const [updatingTarget, setUpdatingTarget] = useState(false);
  
  // Custom intake state
  const [isCustomIntake, setIsCustomIntake] = useState(false);
  const [customIntakeAmount, setCustomIntakeAmount] = useState('');
  const [showCustomIntakeModal, setShowCustomIntakeModal] = useState(false);

  // Get token from AsyncStorage
  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Using token:', token);
      
      if (!token) {
        // Handle not authenticated case
        Alert.alert('Error', 'You need to log in');
        // Navigate to login screen if needed
        // navigation.navigate('Login');
      }
      return token;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  };

  // Update current time
  const updateCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    setCurrentTime(`${hours}:${minutes}`);
  };

  // Fetch today's data
  const fetchTodayData = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const response = await axios.get(`${API_URL}/water/today`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setTodayData(response.data);
      updateCurrentTime();
      setLoading(false);
    } catch (error) {
      console.error('Error fetching today data:', error);
      setLoading(false);
    }
  };

  // Fetch weekly data
  const fetchWeeklyData = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const response = await axios.get(`${API_URL}/water/weekly`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Process weekly data
      const weekData = Array(7).fill(false);
      
      response.data.forEach(day => {
        const dayDate = new Date(day.date);
        const dayIndex = dayDate.getDay();
        weekData[dayIndex] = day.goal_achieved;
      });
      
      setWeeklyCompletion(weekData);
    } catch (error) {
      console.error('Error fetching weekly data:', error);
    }
  };

  // Handle option selection
  const handleOptionSelect = (option) => {
    if (option.amount === 'custom') {
      setIsCustomIntake(true);
      setCustomIntakeAmount('');
      setShowCustomIntakeModal(true);
    } else {
      setIsCustomIntake(false);
      setSelectedAmount(option.amount);
    }
  };

  // Add water intake
  const addWaterIntake = async () => {
    if (submitting) return;
    
    // Get the amount to add
    let amountToAdd = selectedAmount;
    
    if (isCustomIntake) {
      const customAmount = parseInt(customIntakeAmount);
      if (isNaN(customAmount) || customAmount <= 0) {
        Alert.alert('Invalid Input', 'Please enter a valid amount');
        return;
      }
      amountToAdd = customAmount;
    }
    
    try {
      setSubmitting(true);
      const token = await getToken();
      if (!token) return;

      const response = await axios.post(
        `${API_URL}/water/intake`,
        { amount: amountToAdd },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      setTodayData(response.data);
      updateCurrentTime();
      
      // If goal achieved, update weekly data
      if (response.data.goal_achieved) {
        const newWeeklyData = [...weeklyCompletion];
        const today = new Date().getDay();
        newWeeklyData[today] = true;
        setWeeklyCompletion(newWeeklyData);
      }
      
      // Show success message
      Alert.alert('Success', `Added ${amountToAdd}ml of water!`);
      
      // Reset custom intake
      if (isCustomIntake) {
        setShowCustomIntakeModal(false);
        setIsCustomIntake(false);
        setSelectedAmount(100); // Reset to default
      }
    } catch (error) {
      console.error('Error adding water intake:', error);
      Alert.alert('Error', 'Failed to add water intake');
    } finally {
      setSubmitting(false);
    }
  };

  // Update water goal
  const updateWaterGoal = async () => {
    if (updatingTarget) return;
    
    // Validate input
    const goalValue = parseInt(newTarget);
    if (isNaN(goalValue) || goalValue < 100) {
      Alert.alert('Invalid Input', 'Please enter a valid number (minimum 100ml)');
      return;
    }
    
    try {
      setUpdatingTarget(true);
      const token = await getToken();
      if (!token) return;

      const response = await axios.put(
        `${API_URL}/water/goal`,
        { goal_ml: goalValue },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      setTodayData(response.data);
      setIsEditingTarget(false);
      Alert.alert('Success', `Daily water target updated to ${goalValue}ml`);
    } catch (error) {
      console.error('Error updating water goal:', error);
      Alert.alert('Error', 'Failed to update water goal');
    } finally {
      setUpdatingTarget(false);
    }
  };

  // Open target edit modal
  const openTargetEditModal = () => {
    setNewTarget(todayData.goal_ml.toString());
    setIsEditingTarget(true);
  };

  // Handle custom intake confirmation
  const confirmCustomIntake = () => {
    const customAmount = parseInt(customIntakeAmount);
    if (isNaN(customAmount) || customAmount <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid amount');
      return;
    }
    
    setShowCustomIntakeModal(false);
    addWaterIntake();
  };

  // Load data on component mount
  useEffect(() => {
    setLoading(true);
    const loadData = async () => {
      await fetchTodayData();
      await fetchWeeklyData();
    };
    
    loadData();
    
    // Set up interval to refresh data every 5 minutes
    const refreshInterval = setInterval(() => {
      fetchTodayData();
      fetchWeeklyData();
    }, 5 * 60 * 1000);
    
    // Clean up interval on unmount
    return () => clearInterval(refreshInterval);
  }, []);

  // Calculate water level percentage for the glass visualization
  const waterLevelPercentage = Math.min(100, (todayData.consumed_ml / todayData.goal_ml) * 100);
  
  // Calculate number of glasses (assuming 1 glass = 200ml)
  const glassCount = Math.round(todayData.consumed_ml / 200);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0093E9" />
        <Text style={styles.loadingText}>Loading your water data...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Water Intake Card */}
      <View style={styles.intakeCard}>
        <Text style={styles.timeText}>{currentTime}</Text>
        <Text style={styles.intakeInfo}>
          {todayData.consumed_ml}ml water ({glassCount} Glass)
        </Text>
        <TouchableOpacity 
          style={styles.waterWave}
          onPress={openTargetEditModal}
        >
          <Text style={styles.targetLabel}>Target (tap to edit)</Text>
          <Text style={styles.targetAmount}>{todayData.goal_ml}ml</Text>
        </TouchableOpacity>
      </View>

      {/* Glass Icon */}
      <View style={styles.glassContainer}>
        <View style={styles.glass}>
          <View style={[styles.glassWaterLevel, { height: `${waterLevelPercentage}%` }]} />
        </View>
      </View>

      {/* Progress Text */}
      <Text style={styles.progressText}>
        {todayData.goal_achieved 
          ? 'Goal achieved! Great job!' 
          : `${Math.round(waterLevelPercentage)}% of daily goal`}
      </Text>

      {/* Intake Options */}
      <View style={styles.optionsContainer}>
        {waterOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.option}
            onPress={() => handleOptionSelect(option)}
          >
            <Icon
              name={option.icon}
              size={24}
              color="#0093E9"
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>{option.label}</Text>
            <View 
              style={[
                styles.radioCircle, 
                (!isCustomIntake && selectedAmount === option.amount) && styles.selectedRadio,
                (isCustomIntake && option.amount === 'custom') && styles.selectedRadio
              ]} 
            />
          </TouchableOpacity>
        ))}

        <TouchableOpacity 
          style={[styles.confirmButton, (submitting || isCustomIntake) && styles.disabledButton]}
          onPress={addWaterIntake}
          disabled={submitting || isCustomIntake}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.confirmText}>Confirm</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Weekly Completion */}
      <View style={styles.weeklyContainer}>
        <Text style={styles.weeklyTitle}>Weekly Completion</Text>
        <View style={styles.weekRow}>
          {weekDays.map((day, index) => (
            <View key={day} style={styles.dayItem}>
              <View style={[styles.checkCircle, weeklyCompletion[index] && styles.checked]}>
                {weeklyCompletion[index] && <Icon name="check" size={12} color="#fff" />}
              </View>
              <Text style={styles.dayText}>{day}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Target Edit Modal */}
      <Modal
        visible={isEditingTarget}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsEditingTarget(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Daily Water Target</Text>
            
            <TextInput
              style={styles.targetInput}
              value={newTarget}
              onChangeText={setNewTarget}
              keyboardType="number-pad"
              placeholder="Enter target in ml"
              placeholderTextColor="#999"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsEditingTarget(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton, updatingTarget && styles.disabledButton]}
                onPress={updateWaterGoal}
                disabled={updatingTarget}
              >
                {updatingTarget ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Custom Intake Modal */}
      <Modal
        visible={showCustomIntakeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowCustomIntakeModal(false);
          setIsCustomIntake(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Custom Water Intake</Text>
            
            <TextInput
              style={styles.targetInput}
              value={customIntakeAmount}
              onChangeText={setCustomIntakeAmount}
              keyboardType="number-pad"
              placeholder="Enter amount in ml"
              placeholderTextColor="#999"
              autoFocus={true}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowCustomIntakeModal(false);
                  setIsCustomIntake(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton, submitting && styles.disabledButton]}
                onPress={confirmCustomIntake}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Add</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#EAF6FB',
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EAF6FB',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#0093E9',
  },
  intakeCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 20,
  },
  timeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  intakeInfo: {
    fontSize: 16,
    color: '#888',
    marginBottom: 12,
  },
  waterWave: {
    backgroundColor: '#B3E5FC',
    padding: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  targetLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },
  targetAmount: {
    fontSize: 18,
    color: '#555',
  },
  glassContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  glass: {
    width: 100,
    height: 160,
    borderWidth: 10,
    borderColor: '#81D4FA',
    borderBottomWidth: 0,
    borderRadius: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  glassWaterLevel: {
    backgroundColor: '#81D4FA',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '40%',
  },
  progressText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#0288D1',
    fontWeight: '600',
    marginBottom: 20,
  },
  optionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 30,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  optionIcon: {
    width: 32,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  radioCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#90CAF9',
  },
  selectedRadio: {
    backgroundColor: '#90CAF9',
  },
  confirmButton: {
    backgroundColor: '#90CAF9',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  weeklyContainer: {
    backgroundColor: '#B3E5FC',
    padding: 20,
    borderRadius: 20,
  },
  weeklyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayItem: {
    alignItems: 'center',
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E0F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  checked: {
    backgroundColor: '#0288D1',
  },
  dayText: {
    fontSize: 14,
    color: '#fff',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  targetInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    width: '100%',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#90CAF9',
  },
  cancelButtonText: {
    color: '#555',
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
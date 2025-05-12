import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from "../../constants/api";
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

const API_Path = `${API_URL}/users/me`;

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstname: '',
    lastname: '',
    age: new Date()
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          handleAuthError();
          return;
        }

        console.log("Using token:", token); // Debug log
        
        const response = await fetch(API_Path, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (response.status === 401) {
          handleAuthError();
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const userData = await response.json();
        setUser(userData);
        setFormData({
          username: userData.username || '',
          email: userData.email || '',
          firstname: userData.firstname || '',
          lastname: userData.lastname || '',
          age: userData.age ? new Date(userData.age) : new Date()
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
        Alert.alert('Error', 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleAuthError = async () => {
    Alert.alert(
      'Authentication Error',
      'Your session has expired. Please login again.',
      [
        {
          text: 'OK',
          onPress: async () => {
            await AsyncStorage.removeItem('token');
            router.replace('/login'); // Navigate to login screen
          }
        }
      ]
    );
    setLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({ ...prev, age: selectedDate }));
    }
  };

  const handleGoBack = () => {
    router.replace('/');
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        handleAuthError();
        return;
      }

      // Format the date for the API
      const formattedData = {
        ...formData,
        age: formData.age.toISOString() // Convert Date to ISO string for API
      };

      const response = await fetch(API_Path, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formattedData),
      });

      if (response.status === 401) {
        handleAuthError();
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.status}`);
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#6EC6F2" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Failed to load user data.</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            fetchUserData();
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.retryButton, { marginTop: 10, backgroundColor: '#f44336' }]}
          onPress={() => router.put('/login')}
        >
          <Text style={styles.retryButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon name="arrow-left" size={28} color="#6EC6F2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity
          style={styles.editIcon}
          onPress={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}
        >
          <Icon name={isEditing ? 'check' : 'pencil'} size={20} color="#6EC6F2" />
        </TouchableOpacity>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={formData.username}
          editable={isEditing}
          onChangeText={text => handleInputChange('username', text)}
        />

        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          editable={isEditing}
          onChangeText={text => handleInputChange('email', text)}
          keyboardType="email-address"
        />

        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          value={formData.firstname}
          editable={isEditing}
          onChangeText={text => handleInputChange('firstname', text)}
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          value={formData.lastname}
          editable={isEditing}
          onChangeText={text => handleInputChange('lastname', text)}
        />

        <Text style={styles.label}>Date of Birth</Text>
        <TouchableOpacity 
          style={styles.input}
          disabled={!isEditing}
          onPress={() => isEditing && setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>
            {formData.age.toLocaleDateString()}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={formData.age}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F8FB',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
  },
  editIcon: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 6,
    borderWidth: 2,
    borderColor: '#6EC6F2',
  },
  form: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 6,
    color: '#000',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 4,
    color: '#000',
  },
  dateText: {
    fontSize: 16,
    color: '#000',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#6EC6F2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../constants/api";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "../../assets/styles/profile.js";
import { useAuthApp } from "../../auth/authApp.js";
import { showMessage } from "react-native-flash-message";

const API_Path = `${API_URL}/users/me`;

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstname: "",
    lastname: "",
    birthdate: new Date(),
    weight: "",
    height: "",
    gender: "",
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { logout } = useAuthApp();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          handleAuthError();
          return;
        }

        const response = await fetch(API_Path, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
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
          username: userData.username || "",
          email: userData.email || "",
          firstname: userData.firstname || "",
          lastname: userData.lastname || "",
          birthdate: userData.birthdate
            ? new Date(userData.birthdate)
            : new Date(),
          weight: userData.weight?.toString() || "",
          height: userData.height?.toString() || "",
          gender: userData.gender || "",
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
        showMessage({
          message: "Error",
          description: "Failed to load profile data",
          type: "danger",
          icon: "auto",
          duration: 4000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleAuthError = async () => {
    Alert.alert(
      "Authentication Error",
      "Your session has expired. Please login again."
    );
    setLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData((prev) => ({ ...prev, birthdate: selectedDate }));
    }
  };

  const handleGoBack = () => {
    router.replace("/");
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        handleAuthError();
        return;
      }

      // Format the date for the API
      const formattedData = {
        ...formData,
        birthdate: formData.birthdate.toISOString(),
      };

      const response = await fetch(API_Path, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
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
      showMessage({
        message: "Success",
        description: "Profile updated successfully!",
        type: "success",
        icon: "auto",
        duration: 4000,
      });
    } catch (error) {
      console.error("Update error:", error);
      showMessage({
        message: "Error",
        description: "Failed to update profile",
        type: "danger",
        icon: "auto",
        duration: 4000,
      });
    }
  };

  const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getRecommendedWaterIntake = (weight, age, sex) => {
    const weightKg = parseFloat(weight);
    const ageNum = parseInt(age);
    const isMale = sex === "male";

    if (isNaN(weightKg) || isNaN(ageNum)) return null;

    let multiplier = 35;
    if (isMale) multiplier += 5;
    if (ageNum > 55) multiplier -= 5;
    else if (ageNum < 18) multiplier -= 5;

    return Math.round(weightKg * multiplier);
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#6EC6F2" />
      </View>
    );
  }

  if (!user) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text>Failed to load user data.</Text>
        <TouchableOpacity
          style={[
            styles.retryButton,
            { marginTop: 10, backgroundColor: "#f44336" },
          ]}
          onPress={logout}
        >
          <Text style={styles.retryButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
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
          <Icon
            name={isEditing ? "check" : "pencil"}
            size={20}
            color="#6EC6F2"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { marginBottom: 4 }]}>
          💧 Recommended Daily Water Intake
        </Text>
        {formData.weight && formData.birthdate && formData.gender ? (
          <Text style={{ fontSize: 16, color: "#333" }}>
            You should drink approximately{" "}
            <Text style={{ fontWeight: "bold", color: "#6EC6F2" }}>
              {getRecommendedWaterIntake(
                formData.weight,
                calculateAge(formData.birthdate),
                formData.gender
              )}{" "}
              ml
            </Text>{" "}
            of water per day.
          </Text>
        ) : (
          <Text style={{ fontSize: 14, color: "gray" }}>
            Please complete your weight, gender and birthdate.
          </Text>
        )}
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={formData.username}
          editable={isEditing}
          onChangeText={(text) => handleInputChange("username", text)}
        />

        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          editable={isEditing}
          onChangeText={(text) => handleInputChange("email", text)}
          keyboardType="email-address"
        />

        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          value={formData.firstname}
          editable={isEditing}
          onChangeText={(text) => handleInputChange("firstname", text)}
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          value={formData.lastname}
          editable={isEditing}
          onChangeText={(text) => handleInputChange("lastname", text)}
        />

        <View style={styles.section}>
          <Text style={styles.label}>Select Your Gender</Text>
          <View style={styles.genderContainer}>
            {[
              { label: "Male", icon: "👨", value: "male" },
              { label: "Female", icon: "👩", value: "female" },
            ].map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.genderOption,
                  formData.gender === option.value &&
                    styles.genderOptionSelected,
                ]}
                disabled={!isEditing}
                onPress={() => {
                  if (isEditing) {
                    setFormData((prev) => ({ ...prev, gender: option.value }));
                  }
                }}
              >
                <Text style={styles.genderIcon}>{option.icon}</Text>
                <Text
                  style={[
                    styles.genderLabel,
                    formData.gender === option.value &&
                      styles.genderLabelSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={styles.label}>Date of Birth</Text>
        <TouchableOpacity
          style={styles.input}
          disabled={!isEditing}
          onPress={() => isEditing && setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>
            {formData.birthdate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={formData.birthdate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput
              style={styles.input}
              value={formData.weight}
              editable={isEditing}
              onChangeText={(text) => handleInputChange("weight", text)}
              keyboardType="numeric"
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Height (cm)</Text>
            <TextInput
              style={styles.input}
              value={formData.height}
              editable={isEditing}
              onChangeText={(text) => handleInputChange("height", text)}
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Icon
            name="sign-out"
            size={18}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import styles from "../../assets/styles/setup.js";
import { useAuthApp } from "../../auth/authApp.js";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const UserSetupPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState(null);

  const { updateProfile, user } = useAuthApp();

  const router = useRouter();

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === "android") setShowPicker(false);
    if (selectedDate) {
      setBirthdate(selectedDate);
    }
  };

  const handleNext = async () => {
    if (!user || !user._id) {
      Alert.alert("User not authenticated", "Please login again.");
      return;
    }

    if (!firstName || !lastName || !weight || !height || !gender) {
      Alert.alert(
        "Missing Information",
        "Please fill in all the fields.",
        [{ text: "OK" }],
        { cancelable: false }
      );
      return;
    }

    const data = await updateProfile({
      userId: user._id,
      firstname: firstName,
      lastname: lastName,
      birthdate,
      gender,
      weight,
      height,
    });

    if (data.error) {
      Alert.alert("Error", data.error, [{ text: "OK" }], {
        cancelable: false,
      });
    }

    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
        <TouchableOpacity
          onPress={() => router.replace("/(tabs)")}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={20} color="#007AFF" />
          <Text style={{ fontSize: 16, color: "#007AFF", marginLeft: 8 }}>
            Back
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Illustration */}
        <Image
          source={require("../../assets/images/Report-rafiki.png")}
          style={styles.heroImage}
        />

        <Text style={styles.header}>Basic Details</Text>

        <View style={styles.section}>
          <Text style={styles.label}>What is your First Name</Text>
          <TextInput
            placeholder="First Name"
            placeholderTextColor="#999"
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>What is your Last Name</Text>
          <TextInput
            placeholder="Last Name"
            placeholderTextColor="#999"
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

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
                  gender === option.value && styles.genderOptionSelected,
                ]}
                onPress={() => setGender(option.value)}
              >
                <Text style={styles.genderIcon}>{option.icon}</Text>
                <Text
                  style={[
                    styles.genderLabel,
                    gender === option.value && styles.genderLabelSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>What is your Birthdate</Text>
          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            style={styles.input}
          >
            <Text style={{ fontSize: 16, color: "#000" }}>
              {moment(birthdate).format("DD / MM / YYYY")}
            </Text>
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={birthdate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
        </View>

        <View style={styles.row}>
          <View style={styles.sectionHalf}>
            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput
              placeholder="70"
              placeholderTextColor="#999"
              keyboardType="numeric"
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
            />
          </View>
          <View style={styles.sectionHalf}>
            <Text style={styles.label}>Height (cm)</Text>
            <TextInput
              placeholder="170"
              placeholderTextColor="#999"
              keyboardType="numeric"
              style={styles.input}
              value={height}
              onChangeText={setHeight}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.nextButton,
            !firstName || !lastName || !weight || !height || !gender
              ? { backgroundColor: "#b0c4de" }
              : {},
          ]}
          onPress={handleNext}
          disabled={!firstName || !lastName || !weight || !height || !gender}
        >
          <Text style={styles.nextButtonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserSetupPage;

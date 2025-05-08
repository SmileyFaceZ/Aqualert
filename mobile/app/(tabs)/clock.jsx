import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../assets/styles/clock.js";

export default function Clock1Page() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>💧 Aqualert</Text>
        <Text style={styles.subtitle}>Set up your hydration reminders</Text>
      </View>

      {/* Date Display */}
      <View style={styles.dateContainer}>
        <Ionicons name="calendar-outline" size={20} color="#5A9BF6" />
        <Text style={styles.dateText}>Monday, 3 March 2024</Text>
      </View>

      {/* Reminder Clocks */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {[1, 2, 3].map((item, index) => (
          <View key={index} style={styles.clockCard}>
            <View>
              <Text style={styles.clockTime}>08:00 AM</Text>
              <Text style={styles.volumeText}>Drink 250 ml</Text>
            </View>
            <Ionicons name="time-outline" size={26} color="#5A9BF6" />
          </View>
        ))}
      </ScrollView>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Reminders</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

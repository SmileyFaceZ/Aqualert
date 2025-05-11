import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Alert,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import styles from "../../assets/styles/clock";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function ClockPage() {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState(new Date());
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    const setupNotifications = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        const { status: newStatus } =
          await Notifications.requestPermissionsAsync();
        if (newStatus !== "granted") {
          Alert.alert("Permission Required", "Please allow notifications.");
          return;
        }
      }

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.HIGH,
          sound: true,
        });
      }
    };

    setupNotifications();
  }, []);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (selectedDate) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  const scheduleReminder = async () => {
    console.log("Ckicked scheduleReminder");
    const now = new Date();
    const selectedTime = new Date();

    selectedTime.setHours(date.getHours());
    selectedTime.setMinutes(date.getMinutes());
    selectedTime.setSeconds(0);
    selectedTime.setMilliseconds(0);

    if (selectedTime <= now) {
      selectedTime.setDate(selectedTime.getDate() + 1);
    }

    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: "💧 Time to hydrate!",
          body: "Drink 250 ml of water.",
          sound: true,
        },
        trigger: {
          hour: selectedTime.getHours(),
          minute: selectedTime.getMinutes(),
          repeats: true,
        },
      });

      setReminders((prev) => [
        ...prev,
        {
          id,
          time: selectedTime.toISOString(),
        },
      ]);

      Alert.alert("Success", "Reminder added!");
    } catch (error) {
      Alert.alert("Error", "Failed to schedule reminder.");
    }
  };

  const cancelReminder = async (id) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(id);
      setReminders((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      Alert.alert("Error", "Failed to cancel reminder.");
    }
  };

  const renderReminderItem = ({ item }) => {
    const dateObj = new Date(item.time);
    return (
      <View style={styles.reminderItem}>
        <View>
          <Text style={styles.clockTime}>
            {dateObj.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          <Text style={styles.volumeText}>{dateObj.toDateString()}</Text>
        </View>
        <TouchableOpacity onPress={() => cancelReminder(item.id)}>
          <Ionicons name="trash-outline" size={24} color="red" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>💧 Aqualert</Text>
        <Text style={styles.subtitle}>Set up your hydration reminders</Text>
      </View>

      <TouchableOpacity onPress={showDatePicker} style={styles.clockCard}>
        <View>
          <Text style={styles.clockTime}>
            {date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
        <Ionicons name="time-outline" size={26} color="#5A9BF6" />
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        minimumDate={new Date()}
      />

      <TouchableOpacity style={styles.saveButton} onPress={scheduleReminder}>
        <Text style={styles.saveButtonText}>Add Reminder</Text>
      </TouchableOpacity>

      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={renderReminderItem}
        contentContainerStyle={{ paddingTop: 20 }}
      />
    </SafeAreaView>
  );
}

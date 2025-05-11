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
import { API_URL } from "../../constants/api.js";
import { useAuthApp } from "../../auth/authApp.js";
import { useReminderApp } from "../../auth/reminderApp.js";

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
  const [waterSize, setWaterSize] = useState("250");
  const { user } = useAuthApp();
  const { isLoading, getReminders, cancelReminder, changeNotified } =
    useReminderApp();

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

    const fetchReminders = async () => {
      try {
        const data = await getReminders(user._id);
        if (!data) return;

        const formatted = data.map((r) => ({
          ...r,
          id: r._id,
          time: r.scheduled_time,
          waterSize: r.water_size,
          enabled: r.is_notified,
        }));
        setReminders(formatted);
      } catch (err) {
        console.error("Failed to load reminders:", err);
      }
    };

    setupNotifications();
    fetchReminders();
  }, []);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (selectedDate) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  const scheduleReminder = async () => {
    const now = new Date();
    const selectedTime = new Date();

    selectedTime.setHours(date.getHours());
    selectedTime.setMinutes(date.getMinutes());
    selectedTime.setSeconds(0);
    selectedTime.setMilliseconds(0);

    const duplicate = reminders.some((reminder) => {
      const existing = new Date(reminder.time);
      return (
        existing.getHours() === selectedTime.getHours() &&
        existing.getMinutes() === selectedTime.getMinutes()
      );
    });

    if (duplicate) {
      Alert.alert(
        "Duplicate Reminder",
        "You already have a reminder set at this time."
      );
      return;
    }

    const isInFutureToday = selectedTime.getTime() > now.getTime();

    try {
      let trigger;

      if (isInFutureToday) {
        trigger = {
          hour: selectedTime.getHours(),
          minute: selectedTime.getMinutes(),
          repeats: true,
        };
      } else {
        const delaySeconds = Math.floor(
          (selectedTime.getTime() + 24 * 60 * 60 * 1000 - now.getTime()) / 1000
        );
        trigger = {
          seconds: delaySeconds,
          repeats: false,
        };
      }

      const localId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "💧 Time to hydrate!",
          body: `Drink ${waterSize} ml of water.`,
          sound: true,
        },
        trigger,
      });

      const res = await fetch(`${API_URL}/reminders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user._id,
          scheduled_time: selectedTime.toISOString(),
          water_size: waterSize,
        }),
      });

      if (!res.ok) {
        throw new Error("Backend reminder creation failed.");
      }

      const newReminder = await res.json();

      setReminders((prev) => [
        ...prev,
        {
          id: newReminder._id,
          time: newReminder.scheduled_time,
          enabled: true,
          repeats: isInFutureToday,
          waterSize: newReminder.water_size,
        },
      ]);

      Alert.alert("Success", `Reminder added for ${waterSize} ml!`);
    } catch (error) {
      Alert.alert("Error", "Failed to schedule reminder.");
      console.error(error);
    }
  };

  const handleCancleReminder = async (id) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(id);
      const data = await cancelReminder(id);
      if (data) {
        Alert.alert("Success", data.message);
      }
      setReminders((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      Alert.alert("Error", "Failed to cancel reminder.", error.message);
    }
  };

  const toggleReminder = async (reminder) => {
    if (reminder.enabled) {
      await Notifications.cancelScheduledNotificationAsync(reminder.id);
    } else {
      const dateObj = new Date(reminder.time);
      const newId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "💧 Time to hydrate!",
          body: `Drink ${reminder.waterSize || "250"} ml of water.`,
          sound: true,
        },
        trigger: {
          hour: dateObj.getHours(),
          minute: dateObj.getMinutes(),
          repeats: true,
        },
      });
      reminder.id = newId;
    }

    await changeNotified(reminder._id);

    setReminders((prev) =>
      prev.map((r) =>
        r.time === reminder.time
          ? { ...r, id: reminder.id, enabled: !r.enabled }
          : r
      )
    );
  };

  const renderReminderItem = ({ item }) => {
    const dateObj = new Date(item.time);
    const formattedTime = dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const isActive = item.enabled;

    return (
      <View
        style={[styles.reminderItemCard, !isActive && styles.reminderInactive]}
      >
        <View style={styles.reminderInfo}>
          <View style={styles.reminderIcon}>
            <Ionicons
              name="time-outline"
              size={28}
              color={isActive ? "#5A9BF6" : "#ccc"}
            />
          </View>
          <View>
            <Text style={styles.reminderTime}>{formattedTime}</Text>
            <Text style={styles.reminderText}>
              💧 Water: {item.waterSize || "250"} ml
            </Text>
            <Text
              style={[
                styles.reminderStatus,
                { color: isActive ? "green" : "gray" },
              ]}
            >
              {isActive ? "Active" : "Disabled"}
            </Text>
          </View>
        </View>
        <View style={styles.reminderActions}>
          <TouchableOpacity onPress={() => toggleReminder(item)}>
            <Ionicons
              name={
                isActive ? "notifications-off-outline" : "notifications-outline"
              }
              size={24}
              color={isActive ? "#aaa" : "#007AFF"}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleCancleReminder(item.id)}>
            <Ionicons name="trash-outline" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
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
            <Text style={styles.volumeText}>Tap to change time</Text>
          </View>
          <Ionicons name="time-outline" size={26} color="#5A9BF6" />
        </TouchableOpacity>

        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Select your drink size</Text>
          <View style={styles.bottleOptions}>
            {[
              { label: "200 ml", value: "200", icon: "wine-outline" },
              { label: "250 ml", value: "250", icon: "beer-outline" },
              { label: "300 ml", value: "300", icon: "cafe-outline" },
              { label: "500 ml", value: "500", icon: "water-outline" },
            ].map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.bottleCard,
                  waterSize === item.value && styles.bottleCardSelected,
                ]}
                onPress={() => setWaterSize(item.value)}
              >
                <Ionicons
                  name={item.icon}
                  size={32}
                  color={waterSize === item.value ? "#fff" : "#5A9BF6"}
                />
                <Text
                  style={[
                    styles.bottleLabel,
                    waterSize === item.value && styles.bottleLabelSelected,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="time"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          minimumDate={new Date()}
        />

        <FlatList
          data={reminders}
          keyExtractor={(item) => item.id}
          renderItem={renderReminderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={scheduleReminder}>
        <Text style={styles.saveButtonText}>Add Reminder</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

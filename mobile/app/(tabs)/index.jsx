import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useAuthApp } from "../../auth/authApp.js";

export default function Home() {
  const { logout } = useAuthApp();
  return (
    <View>
      <Text>Home</Text>

      <TouchableOpacity onPress={logout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

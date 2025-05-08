import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuthApp } from "../../auth/authApp.js";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { user, isLoading, register } = useAuthApp();

  const router = useRouter();

  const handleSignup = async () => {
    const result = await register(username, email, password);
    if (!result.success) {
      alert(result.error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View>
        <View>
          <Text>Aqualert</Text>

          <View>
            {/* Username Input */}
            <View>
              <Text>Username</Text>
              <View>
                <Ionicons name="person-outline" size={24} />
                <TextInput
                  placeholder="John Doe"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Email Input */}
            <View>
              <Text>Email</Text>
              <View>
                <Ionicons name="mail-outline" size={20} />
                <TextInput
                  placeholder="johndoe123@email.com"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Password Input */}
            <View>
              <Text>Password</Text>
              <View>
                <Ionicons name="lock-closed-outline" size={20} />
                <TextInput
                  placeholder="********"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Signup Button */}
            <TouchableOpacity
              onPress={() => handleSignup()}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text>Sign Up</Text>
              )}
            </TouchableOpacity>

            {/* Footer */}
            <View>
              <Text>
                Already have an account?
                <TouchableOpacity onPress={() => router.back()}>
                  <Text> Login</Text>
                </TouchableOpacity>
              </Text>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useAuthApp } from "../../auth/authApp.js";
import styles from "../../assets/styles/login.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { isLoading, login } = useAuthApp();

  const handleLogin = async () => {
    const result = await login(email, password);
    if (!result.success) {
      alert(result.error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.inner}>
        <Image
          source={require("../../assets/images/bottle-of-water-amico.png")}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to continue staying hydrated</Text>

        {/* Email Input */}
        <View style={styles.inputGroup}>
          <Ionicons name="mail-outline" size={20} color="#4A90E2" />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#888"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputGroup}>
          <Ionicons name="lock-closed-outline" size={20} color="#4A90E2" />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#888"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#4A90E2"
            />
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don’t have an account?</Text>
          <Link href="/signup" asChild>
            <TouchableOpacity>
              <Text style={styles.signupLink}> Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

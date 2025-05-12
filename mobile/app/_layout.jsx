import SafeScreen from "../components/SafeScreen";
import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useAuthApp } from "../auth/authApp.js";
import { useEffect, useState } from "react";
import React from "react";
import FlashMessage from "react-native-flash-message";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { checkAuth, user, token, isNewUser } = useAuthApp();

  const [isReady, setIsReady] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setIsReady(true);
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isReady || segments.length === 0) return;

    const inAuthScreen = segments[0] === "(auth)";
    const isSignedIn = user && token;

    if (!isSignedIn && !inAuthScreen) {
      router.replace("/(auth)");
    } else if (isSignedIn && inAuthScreen) {
      if (isNewUser) {
        router.replace("/(setup)");
      } else {
        router.replace("/(tabs)");
      }
    }
  }, [isReady, user, token, segments]);

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <FlashMessage
          position="top"
          style={{ marginTop: insets.top }}
        />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(setup)" />
        </Stack>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}

import { Stack } from "expo-router"; // Expo Router kullanıyorsanız Stack component'i burada
import React from "react";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="register" options={{ title: 'Register' }} />
      <Stack.Screen name="login" options={{ title: 'Login' }} />
    </Stack>
  );
}

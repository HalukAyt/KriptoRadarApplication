import { Stack } from "expo-router";
import React from "react";

export default function Layout() {
  return (
    <Stack >
      <Stack.Screen name="index" options={{ title: 'Home', headerShown: false }} />
      <Stack.Screen name="register" options={{ title: 'Register', headerShown: false }} />
      <Stack.Screen name="login" options={{ title: 'Login' , headerShown: false}} />
      <Stack.Screen name="home" options={{ title: 'Home' , headerShown: false}} />
      <Stack.Screen name="order" options={{ title: 'order', headerShown: false}}/>
      <Stack.Screen name="tradebot" options={{ title: 'Tradebot', headerShown: false}}/>
    </Stack>
  );
}

import React from "react";
import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router"; // Expo Router'ı kullanarak yönlendirme yapmak için

export default function Index() {
  const router = useRouter(); // useRouter kullanarak yönlendirme yapıyoruz

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Welcome to the Home Screen!</Text>
      <Button
        title="Go to Register"
        onPress={() => router.push("/register")} // Register ekranına yönlendir
      />
      <Button
        title="Go to Login"
        onPress={() => router.push("/login")} // Login ekranına yönlendir
      />
    </View>
  );
}

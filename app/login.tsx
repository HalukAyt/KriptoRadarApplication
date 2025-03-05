import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage importu
import { loginUser } from "../api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const token = await loginUser(email, password); // loginUser API fonksiyonunuz
    if (token) {
      // Giriş başarılıysa token'ı AsyncStorage'a kaydet
      await AsyncStorage.setItem("userToken", token);
      router.push("/home");
    } else {
      Alert.alert("Login Failed", "Invalid credentials");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default Login;

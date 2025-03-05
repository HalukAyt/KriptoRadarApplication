import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { loginUser } from "../api"; // API fonksiyonunuzu buraya ekleyin

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const token = await loginUser(email, password);
    if (token) {
      Alert.alert("Login Success", `Token: ${token}`);
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

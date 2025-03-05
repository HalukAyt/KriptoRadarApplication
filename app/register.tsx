import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { registerUser } from "../api"; // API fonksiyonunuzu buraya ekleyin

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");

  const handleRegister = async () => {
    const message = await registerUser(username, email, password, apiKey, apiSecret);
    Alert.alert(message);
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
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
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="API Key"
        value={apiKey}
        onChangeText={setApiKey}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="API Secret"
        value={apiSecret}
        onChangeText={setApiSecret}
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

export default Register;

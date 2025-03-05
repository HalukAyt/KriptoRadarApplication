import React, { useState } from 'react';
import { TextInput, Button, Alert } from 'react-native';
import { loginUser } from './api';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const token = await loginUser(email, password);
    if (token) {
      Alert.alert('Login Success', `Token: ${token}`);
    } else {
      Alert.alert('Login Failed', 'Invalid credentials');
    }
  };

  return (
    <React.Fragment>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
    </React.Fragment>
  );
};

export default LoginScreen;

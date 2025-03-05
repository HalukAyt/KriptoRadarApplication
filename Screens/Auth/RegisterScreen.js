import React, { useState } from 'react';
import { TextInput, Button, Alert } from 'react-native';
import { registerUser } from '../api';


const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');

  const handleRegister = async () => {
    const message = await registerUser(username, email, password, apiKey, apiSecret);
    Alert.alert(message);
  };

  return (
    <React.Fragment>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
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
      <TextInput
        placeholder="API Key"
        value={apiKey}
        onChangeText={setApiKey}
      />
      <TextInput
        placeholder="API Secret"
        value={apiSecret}
        onChangeText={setApiSecret}
      />
      <Button title="Register" onPress={handleRegister} />
    </React.Fragment>
  );
};

export default RegisterScreen;

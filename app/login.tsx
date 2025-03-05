import React, { useState } from "react";
import { View, TextInput, Button, Alert, Text } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser } from "../api"; // Kullanıcı giriş fonksiyonu

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Yükleniyor durumu
  const [errorMessage, setErrorMessage] = useState(""); // Hata mesajı
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true); // Yükleme işlemi başladı
    setErrorMessage(""); // Önceki hata mesajını temizle

    try {
      // Kullanıcı giriş API çağrısı
      const token = await loginUser(email, password);

      if (token) {
        // 🎯 Token'ı AsyncStorage'a kaydet
        await AsyncStorage.setItem("userToken", token);

        // API Key & Secret'ı sakla
        const apiKey = await AsyncStorage.getItem("apiKey");
        const apiSecret = await AsyncStorage.getItem("apiSecret");

        if (apiKey && apiSecret) {
          console.log("✅ API bilgileri kaydedildi!");
        }
        
        // Home sayfasına yönlendir
        router.replace("/home");
      } else {
        setErrorMessage("Geçersiz kullanıcı bilgileri.");
        Alert.alert("Giriş Başarısız", "Geçersiz kullanıcı bilgileri.");
      }
    } catch (error) {
      console.error("Giriş sırasında hata:", error);
      setErrorMessage("Giriş sırasında bir sorun oluştu.");
      Alert.alert("Hata", "Giriş sırasında bir sorun oluştu.");
    } finally {
      setLoading(false); // Yükleme durumu sonlandı
    }
  };

  return (
    <View style={{ padding: 20 }}>
      {/* Hata mesajı */}
      {errorMessage ? <Text style={{ color: "red", marginBottom: 10 }}>{errorMessage}</Text> : null}

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderBottomWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderBottomWidth: 1, marginBottom: 20, padding: 5 }}
      />
      <Button title={loading ? "Giriş Yapılıyor..." : "Login"} onPress={handleLogin} disabled={loading} />
    </View>
  );
};

export default Login;

import React, { useState } from "react";
import { View, TextInput, Button, Alert, Text, StyleSheet, ScrollView } from "react-native";
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
    <ScrollView contentContainerStyle={styles.container}>
      {/* Hata mesajı */}
      {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button
        title={loading ? "Giriş Yapılıyor..." : "Login"}
        onPress={handleLogin}
        disabled={loading}
        color="#4CAF50" // Buton rengi
      />

      {/* Alt alan - ekstra bilgiler veya yönlendirmeler */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Hesabınız yok mu?</Text>
        <Text style={styles.signupLink} onPress={() => router.push("/register")}>Kayıt Ol</Text>
      </View>
    </ScrollView>
  );
};

// Stil tanımlamaları
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#00000f",
  },
  input: {
    width: "100%",
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  errorMessage: {
    color: "red",
    marginBottom: 10,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#555",
  },
  signupLink: {
    fontSize: 16,
    color: "#4CAF50",
    textDecorationLine: "underline",
    marginTop: 5,
  },
});

export default Login;

import React, { useEffect, useState } from "react";
import { View, Text, Button, BackHandler, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      const userToken = await AsyncStorage.getItem("userToken");
      if (!userToken) {
        router.replace("/login"); // Kullanıcı oturumu yoksa login sayfasına yönlendir
      } else {
        setIsAuthenticated(true);
      }
    };

    checkAuth();

    // Geri tuşunu engelleme
    const backAction = () => {
      return true; // Geri tuşu çalışmaz
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    router.replace("/login"); // router.push yerine router.replace kullanıyoruz!
  };

  return (
    <View style={styles.container}>
      {/* Status Bar Rengini Koyu Yap */}
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      {isAuthenticated ? (
        <>
          <Text style={styles.welcomeText}>Welcome to the Home Screen!</Text>
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => router.push("/order")}
          >
            <Text style={styles.buttonText}>ORDERS</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button} 
            onPress={() => router.push("/tradebot")}
          >
            <Text style={styles.buttonText}>tradebot</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.logoutButton]} 
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.loadingText}>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212", // Karanlık bir tema
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#00b894", // Yeşil bir renk tonu
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  logoutButton: {
    backgroundColor: "#e74c3c", // Kırmızı bir renk tonu logout için
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
  },
});

export default Home;

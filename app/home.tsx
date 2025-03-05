import React, { useEffect, useState } from "react";
import { View, Text, Button, BackHandler } from "react-native";
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
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {isAuthenticated ? (
        <>
          <Text>Welcome to the Home Screen!</Text>
          <Button title="Logout" onPress={handleLogout} />
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default Home;

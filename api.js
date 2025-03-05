import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.0.2.2:5122/api/auth'; // Backend API URL'si

// ✅ Kayıt olma (Register)
const registerUser = async (username, email, password, apiKey, apiSecret) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      Username: username,
      Email: email,
      Password: password,
      ApiKey: apiKey,
      ApiSecret: apiSecret,
    });

    return response.data.message;
  } catch (error) {
    console.error('❌ Register Hatası:', error.response?.data?.message || error.message);
    return error.response?.data?.message || "Kayıt başarısız!";
  }
};

// ✅ Kullanıcı giriş fonksiyonu
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });

    // API yanıtını kontrol et
    console.log("🔍 API Yanıtı:", response.data);

    // Yanıtın beklediğin formatta olup olmadığını kontrol et
    if (!response.data.loginResponse || !response.data.loginResponse.token || !response.data.loginResponse.apiKey || !response.data.loginResponse.apiSecret) {
      throw new Error("Giriş başarısız! Token veya API Key/Secret eksik.");
    }

    // login başarılıysa, verileri AsyncStorage'a kaydet
    await AsyncStorage.setItem("userToken", response.data.loginResponse.token);
    await AsyncStorage.setItem("apiKey", response.data.loginResponse.apiKey);
    await AsyncStorage.setItem("apiSecret", response.data.loginResponse.apiSecret);

    return response.data.loginResponse.token;  // Token döndürülüyor
  } catch (error) {
    console.error("⚠ Giriş Hatası:", error.response?.data?.message || error.message);
    return null;
  }
};

// ✅ Kullanıcıyı çıkış yaptır (Verileri temizle)
export const logoutUser = async () => {
  await AsyncStorage.removeItem("userToken");
  await AsyncStorage.removeItem("apiKey");
  await AsyncStorage.removeItem("apiSecret");
};

// ✅ Binance API Key & Secret'ı AsyncStorage'dan al
export const getBinanceCredentials = async () => {
  try {
    const apiKey = await AsyncStorage.getItem("apiKey");
    const apiSecret = await AsyncStorage.getItem("apiSecret");
    return { apiKey, apiSecret };
  } catch (error) {
    console.error("❌ Binance API bilgileri alınamadı:", error);
    return { apiKey: null, apiSecret: null };
  }
};

export { registerUser };

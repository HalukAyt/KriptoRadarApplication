import axios from 'axios';

const API_URL = 'http://10.0.2.2:5122/api/auth';

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
    console.error('Register Error:', error.response.data.message);
    return error.response.data.message;
  }
};
const loginUser = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        Email: email,
        Password: password,
      });
      return response.data.token;  // Token'ı döndürüyoruz
    } catch (error) {
      console.error('Login Error:', error.response.data.message);
      return null;
    }
  };

export { registerUser , loginUser};

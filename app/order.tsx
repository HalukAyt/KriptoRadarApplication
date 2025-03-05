import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, StatusBar, TextInput, Button, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Ionicons import
import LivePrice from '../LivePrice';
import TradingViewChart from '../TradingViewChart';
import { getBtcBalance, getUsdtBalance, tradeMarketOrder, tradeLimitOrder, getLimitOrders } from '../services/orderService';

export default function Order() {
  const [buyAmount, setBuyAmount] = useState('');
  const [buyLimitPrice, setBuyLimitPrice] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const [sellLimitPrice, setSellLimitPrice] = useState('');
  const [btcBalance, setBtcBalance] = useState('0');
  const [usdtBalance, setUsdtBalance] = useState('0');
  const [limitOrders, setLimitOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter(); // useRouter hook kullanıyoruz

  // ✅ Bakiye verilerini çek
  const fetchBalances = async () => {
    setLoading(true);
    try {
      const btc = await getBtcBalance();
      const usdt = await getUsdtBalance();
      setBtcBalance(btc);
      setUsdtBalance(usdt);
    } catch (error) {
      console.error('Bakiye çekme hatası:', error);
      Alert.alert('Hata', 'Bakiye verileri alınırken bir hata oluştu.');
    }
    setLoading(false);
  };

  // ✅ Aktif limit emirlerini çek
  const fetchLimitOrders = async () => {
    setLoading(true);
    try {
      const orders = await getLimitOrders();
      setLimitOrders(orders);
    } catch (error) {
      console.error('Limit emirlerini alırken hata oluştu:', error);
      Alert.alert('Hata', 'Limit emirleri alınırken bir hata oluştu.');
    }
    setLoading(false);
  };

  // ✅ Sayfa yüklendiğinde verileri çek
  useEffect(() => {
    fetchBalances();
    fetchLimitOrders();
    const interval = setInterval(() => {
      fetchBalances();
      fetchLimitOrders();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ✅ Limit alım işlemi
  const handleLimitBuy = async () => {
    if (!buyAmount || parseFloat(buyAmount) <= 0 || !buyLimitPrice || parseFloat(buyLimitPrice) <= 0) {
      Alert.alert('Hata', 'Lütfen geçerli bir alım miktarı ve limit fiyatı girin.');
      return;
    }
    const btcAmount = (parseFloat(buyAmount) / parseFloat(buyLimitPrice)).toFixed(6);
    if (parseFloat(btcAmount) <= 0) {
      Alert.alert('Hata', 'Geçerli bir BTC miktarı hesaplanamadı.');
      return;
    }
    try {
      await tradeLimitOrder('BUY', btcAmount, buyLimitPrice);
      setBuyAmount('');
      setBuyLimitPrice('');
      fetchBalances();
      fetchLimitOrders();
      Alert.alert('Başarı', `Limit alım emri başarıyla verildi! ${btcAmount} BTC @ ${buyLimitPrice} USDT`);
    } catch (error) {
      console.error('Limit alım hatası:', error);
      Alert.alert('Hata', 'Limit alım emri başarısız.');
    }
  };

  // ✅ Limit satım işlemi
  const handleLimitSell = async () => {
    if (!sellAmount || parseFloat(sellAmount) <= 0 || !sellLimitPrice || parseFloat(sellLimitPrice) <= 0) {
      Alert.alert('Hata', 'Lütfen geçerli bir satım miktarı ve limit fiyatı girin.');
      return;
    }
    try {
      await tradeLimitOrder('SELL', sellAmount, sellLimitPrice);
      setSellAmount('');
      setSellLimitPrice('');
      fetchBalances();
      fetchLimitOrders();
      Alert.alert('Başarı', 'Limit satım emri başarıyla verildi!');
    } catch (error) {
      console.error('Limit satım hatası:', error);
      Alert.alert('Hata', 'Limit satım emri başarısız.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      
      {/* Sol üst köşeye geri butonunu ekleyelim */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={32} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>KRİPTO RADAR</Text>

      <LinearGradient colors={['#00b894', '#1e1e1e']} style={styles.livePriceContainer}>
        <Text style={styles.sectionTitle}>Canlı Fiyat</Text>
        <LivePrice />
      </LinearGradient>

      <LinearGradient colors={['#00b894', '#1e1e1e']} style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>TradingView Grafik</Text>
        <TradingViewChart />
      </LinearGradient>

      <LinearGradient colors={['#00b894', '#1e1e1e']} style={styles.tradeContainer}>
        <Text style={styles.sectionTitle}>Limit Order Alım-Satım</Text>

        {/* Bakiye ve Fiyatları göster */}
        <Text style={styles.balance}>BTC Bakiyesi: {btcBalance}</Text>
        <Text style={styles.balance}>USDT Bakiyesi: {usdtBalance}</Text>

        {/* Limit alım */}
        <TextInput
          style={styles.input}
          placeholder="Limit alım fiyatı girin (USDT)"
          placeholderTextColor="#ddd"
          keyboardType="numeric"
          value={buyLimitPrice}
          onChangeText={setBuyLimitPrice}
        />
        <TextInput
          style={styles.input}
          placeholder="Alım miktarını girin (USDT)"
          placeholderTextColor="#ddd"
          keyboardType="numeric"
          value={buyAmount}
          onChangeText={setBuyAmount}
        />
        <Button title="Limit AL (BUY)" onPress={handleLimitBuy} color="#00ff00"  />
        
        {/* Limit satım */}
        <TextInput
          style={styles.input}
          placeholder="Limit satım fiyatı girin (USDT)"
          placeholderTextColor="#ddd"
          keyboardType="numeric"
          value={sellLimitPrice}
          onChangeText={setSellLimitPrice}
        />
        <TextInput
          style={styles.input}
          placeholder="Satım miktarını girin (BTC)"
          placeholderTextColor="#ddd"
          keyboardType="numeric"
          value={sellAmount}
          onChangeText={setSellAmount}
        />
        <Button title="Limit SAT (SELL)" onPress={handleLimitSell} color="#ff0000"  />

        {/* Loading Spinner */}
        {loading && <ActivityIndicator size="large" color="#00b894" />}
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  backButton: {
    position: 'absolute',
    top: 5,
    left: 5,
    padding: 5,
    zIndex: 10,
  },
  title: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f1f1f1',
    marginBottom: 12,
  },
  livePriceContainer: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  chartContainer: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  tradeContainer: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  balance: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
    fontSize: 18,
  },
});

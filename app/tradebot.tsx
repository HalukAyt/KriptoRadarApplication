import React, { useState, useEffect } from "react";
import { Button, View, Text, Alert, TextInput, ScrollView, TouchableOpacity } from "react-native";
// Picker import işlemi
import { Picker } from '@react-native-picker/picker'; 
import { getUsdtBalance, tradeMarketOrder, getBtcBalance } from "../services/orderService"; // Binance işlemlerini içe aktar
import { useNavigation } from '@react-navigation/native'; // Geri gitmek için navigation kullanacağız

const TradeBot = () => {
  const navigation = useNavigation(); // navigation hook'u kullanıyoruz
  const [status, setStatus] = useState<string>("Bot Başlatılmadı");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [usdtBalance, setUsdtBalance] = useState<string>("0");
  const [logs, setLogs] = useState<string[]>([]);
  const [tradeAmount, setTradeAmount] = useState<string>(""); // Kullanıcının gireceği trade miktarı
  const [selectedCoin, setSelectedCoin] = useState<string>("BTCUSDT"); // Kullanıcının seçeceği coin

  useEffect(() => {
    // Bot başlatılmadan önce bakiyeyi alalım
    const fetchUsdtBalance = async () => {
      const balance = await getUsdtBalance();
      setUsdtBalance(balance);
    };

    fetchUsdtBalance();
  }, []);

  const executeBot = async () => {
    if (!tradeAmount || parseFloat(tradeAmount) <= 0) {
      Alert.alert("Geçersiz Miktar", "Lütfen geçerli bir miktar girin.");
      return;
    }

    setIsRunning(true);
    setStatus("Bot Çalışıyor...");
    setLogs([]); // Her bot başlatıldığında logları sıfırlayalım

    try {
      const balance = await getUsdtBalance();
      setUsdtBalance(balance); // USDT bakiyesini güncelle

      const btcBalance = await getBtcBalance();
      console.log(`USDT Bakiyesi: ${balance}`);
      console.log(`BTC Bakiyesi: ${btcBalance}`);

      setLogs(prevLogs => [...prevLogs, `Başlangıç USDT Bakiyesi: ${balance}`]);

      // Eğer USDT bakiyesi varsa ve bot başlatılabiliyorsa alım yapalım
      if (parseFloat(balance) > parseFloat(tradeAmount)) {
        setLogs(prevLogs => [...prevLogs, `Alım işlemi başlatılıyor...`]);
        await tradeMarketOrder("BUY", parseFloat(tradeAmount), 20000, "BUY", tradeAmount); // Örnek alım fiyatı (gerçek fiyatı dinamik olarak alabilirsiniz)

        // Alım sonrası satışı bekleyelim
        setTimeout(async () => {
          const sellPrice = 20000 * 1.05; // %5 karla satış yapma
          setLogs(prevLogs => [...prevLogs, `Satış işlemi başlatılıyor...`]);
          await tradeMarketOrder("SELL", parseFloat(tradeAmount), sellPrice, "SELL", tradeAmount);
          setStatus("Bot İşlemi Tamamladı!");
          setLogs(prevLogs => [...prevLogs, `Bot işlemi tamamlandı!`]);
        }, 5000); // 5 saniye sonra satış işlemi
      } else {
        Alert.alert("Yetersiz bakiye", "Yeterli USDT bakiyeniz yok.");
        setStatus("Bot Başlatılamadı!");
      }
    } catch (error: unknown) {
      console.error("Bot çalışırken hata oluştu:", error);
      
      // TypeScript hata türünü kontrol et
      if (error instanceof Error) {
        // Eğer 'error' bir Error nesnesiyse
        setStatus("Bot Hata Aldı!");
        Alert.alert("Hata", `Bot çalıştırılırken bir hata oluştu: ${error.message}`);
        setLogs(prevLogs => [...prevLogs, `Hata oluştu: ${error.message}`]);
      } else {
        // Eğer 'error' bir Error nesnesi değilse
        setStatus("Bot Hata Aldı!");
        Alert.alert("Hata", "Bot çalıştırılırken bir hata oluştu.");
        setLogs(prevLogs => [...prevLogs, `Bilinmeyen hata oluştu.`]);
      }
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      {/* Geri Butonu */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', top: 40, left: 20 }}>
        <Text style={{ fontSize: 18, color: 'blue' }}>Geri</Text>
      </TouchableOpacity>

      <Text>Status: {status}</Text>
      <Text>USDT Bakiyesi: {usdtBalance}</Text>

      {/* Kullanıcının işlem yapacağı miktarı girmesi için TextInput */}
      <TextInput
        value={tradeAmount}
        onChangeText={setTradeAmount}
        placeholder="İşlem yapacağınız USDT miktarını girin"
        keyboardType="numeric"
        style={{
          width: "80%",
          padding: 10,
          marginVertical: 20,
          borderColor: "gray",
          borderWidth: 1,
          borderRadius: 5,
        }}
      />

      {/* Kullanıcının işlem yapmak istediği coin'i seçmesi için Picker */}
      <Picker
        selectedValue={selectedCoin}
        onValueChange={(itemValue: string) => setSelectedCoin(itemValue)} // itemValue parametresine tip ekledik
        style={{
          width: "80%",
          height: 50,
          marginVertical: 20,
          borderColor: "gray",
          borderWidth: 1,
          borderRadius: 5,
        }}
      >
        <Picker.Item label="BTCUSDT" value="BTCUSDT" />
        <Picker.Item label="ETHUSDT" value="ETHUSDT" />
        <Picker.Item label="BNBUSDT" value="BNBUSDT" />
        <Picker.Item label="ADAUSDT" value="ADAUSDT" />
        {/* Diğer coin seçeneklerini burada ekleyebilirsiniz */}
      </Picker>

      <Button
        title={isRunning ? "Bot Çalışıyor..." : "Botu Başlat"}
        onPress={executeBot}
        disabled={isRunning}
      />
      
      <ScrollView style={{ marginTop: 20, width: "100%" }}>
        <Text style={{ fontWeight: "bold" }}>İşlem Logları:</Text>
        {logs.map((log, index) => (
          <Text key={index} style={{ color: "gray" }}>
            {log}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
};

export default TradeBot;

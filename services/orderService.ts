import AsyncStorage from "@react-native-async-storage/async-storage";

interface Filter {
    filterType: string;
    stepSize?: string;
    minQty?: string;
    minNotional?: string;
    tickSize?: string;
  }
  
  interface SymbolInfo {
    symbol: string;
    filters: Filter[];
  }
  

const Binance = require("binance-api-react-native").default;

// ✅ Binance API Bağlantısını Dinamik Yap
export const getBinanceInstance = async () => {
  const apiKey = await AsyncStorage.getItem("apiKey");
  const apiSecret = await AsyncStorage.getItem("apiSecret");

  if (!apiKey || !apiSecret) {
    throw new Error("API Key veya Secret bulunamadı!");
  }

  return new Binance({
    apiKey,
    apiSecret,
  });
};

// ✅ BTC Bakiyesini Al
export const getBtcBalance = async (): Promise<string> => {
  try {
    const binance = await getBinanceInstance();
    const account = await binance.accountInfo();
    const btcBalance = account.balances.find((b: { asset: string }) => b.asset === "BTC");
    return btcBalance ? btcBalance.free : "0";
  } catch (error: any) {
    console.error("BTC bakiyesi alınırken hata oluştu:", error);
    return "0";
  }
};

// ✅ USDT Bakiyesini Al
export const getUsdtBalance = async (): Promise<string> => {
  try {
    const binance = await getBinanceInstance();
    const account = await binance.accountInfo();
    const usdtBalance = account.balances.find((b: { asset: string }) => b.asset === "USDT");
    return usdtBalance ? usdtBalance.free : "0";
  } catch (error: any) {
    console.error("USDT bakiyesi alınırken hata oluştu:", error);
    return "0";
  }
};

// ✅ Market Order ile Alım / Satım İşlemi Yap
export const tradeMarketOrder = async (side: "BUY" | "SELL", quantity: string) => {
  try {
    const binance = await getBinanceInstance();
    const orderData = {
      symbol: "BTCUSDT",
      side,
      type: "MARKET",
      ...(side === "BUY" ? { quoteOrderQty: quantity } : { quantity }),
    };

    const orderResponse = await binance.order(orderData);
    console.log(`${side} Market Order Başarılı:`, orderResponse);
    alert(`Başarıyla ${side === "BUY" ? "ALIM" : "SATIM"} yapıldı!`);
  } catch (error: any) {
    console.error(`${side} market order hatası:`, error);
    alert(`İşlem başarısız: ${error.message || "Bilinmeyen hata"}`);
  }
};

// ✅ Limit Order ile Alım / Satım İşlemi Yap
export const tradeLimitOrder = async (side: "BUY" | "SELL", quantity: string, price: string) => {
  try {
    const binance = await getBinanceInstance();
    const marketInfo = await getSymbolInfo();

    if (!marketInfo) return;

    const { stepSize, minNotional, tickSize } = marketInfo;

    // **Fiyatı ve miktarı düzelt**
    const fixedPrice = adjustPrice(parseFloat(price), tickSize);
    let adjustedQuantity = adjustQuantity(parseFloat(quantity), stepSize);

    // **Min emir büyüklüğünü kontrol et**
    if (minNotional && adjustedQuantity * fixedPrice < minNotional) {
      console.log(`⚠ Emir çok küçük! Minimum ${minNotional} USDT olmalı.`);
      alert(`Emir çok küçük! Minimum ${minNotional} USDT.`);
      return;
    }

    const orderData = {
      symbol: "BTCUSDT",
      side,
      type: "LIMIT",
      timeInForce: "GTC",
      quantity: adjustedQuantity.toString(),
      price: fixedPrice.toString(),
    };

    const orderResponse = await binance.order(orderData);
    console.log(`${side} Limit Order Başarılı:`, orderResponse);
    alert(`Limit ${side === "BUY" ? "ALIM" : "SATIM"} emri verildi!`);
  } catch (error: unknown) {
    const errMessage = (error as Error).message || "Bilinmeyen hata";
    console.error(`${side} limit order hatası:`, error);
    alert(`Limit order başarısız: ${errMessage}`);
  }
};

// ✅ Aktif Limit Emirlerini Al
export const getLimitOrders = async (): Promise<any[]> => {
  try {
    const binance = await getBinanceInstance();
    const orders = await binance.openOrders({ symbol: "BTCUSDT" });
    return orders;
  } catch (error) {
    console.error("Limit emirlerini alırken hata oluştu:", error);
    return [];
  }
};

// ✅ Binance'den market bilgilerini al (BTCUSDT)
export const getSymbolInfo = async () => {
  try {
    const binance = await getBinanceInstance();
    const exchangeInfo = await binance.exchangeInfo();
    const symbolInfo = exchangeInfo.symbols.find((s: SymbolInfo) => s.symbol === "BTCUSDT");

    let stepSize, minQty, minNotional, tickSize;
    symbolInfo?.filters.forEach((filter: Filter) => {
      if (filter.filterType === "LOT_SIZE") {
        stepSize = parseFloat(filter.stepSize || "0");
        minQty = parseFloat(filter.minQty || "0");
      }
      if (filter.filterType === "PRICE_FILTER") {
        tickSize = parseFloat(filter.tickSize || "0");
      }
      if (filter.filterType === "MIN_NOTIONAL") {
        minNotional = parseFloat(filter.minNotional || "0");
      }
    });

    return { stepSize, minQty, minNotional, tickSize };
  } catch (error) {
    console.error("Market bilgisi alınırken hata oluştu:", error);
    return null;
  }
};

const adjustPrice = (price: number, tickSize: number | undefined): number => {
  if (tickSize === undefined || isNaN(tickSize)) {
    throw new Error("tickSize geçerli bir sayı olmalıdır.");
  }

  const precision = Math.log10(1 / tickSize);
  return Math.floor(price * Math.pow(10, precision)) / Math.pow(10, precision);
};

const adjustQuantity = (quantity: number, stepSize: number | undefined): number => {
  if (stepSize === undefined || isNaN(stepSize)) {
    throw new Error("stepSize geçerli bir sayı olmalıdır.");
  }

  const precision = Math.log10(1 / stepSize);
  return Math.floor(quantity * Math.pow(10, precision)) / Math.pow(10, precision);
};

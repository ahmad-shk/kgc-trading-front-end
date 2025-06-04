import { useEffect, useState } from 'react';
import axios from 'axios';

interface Order {
  price: number;
  amount: number;
  total: number;
}

interface OrderBook {
  bids: Order[];
  asks: Order[];
}

const useOrderBook = (symbol: string, limit: number = 17) => {
  const [orderBook, setOrderBook] = useState<OrderBook>({ bids: [], asks: [] });
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [lastPrice, setLastPrice] = useState<number>(0);

  // Helper to convert raw array into Order[]
  const mapOrders = (orders: [string, string][]): Order[] =>
    orders.map(([price, quantity]) => ({
      price: parseFloat(price),
      amount: parseFloat(quantity),
      total: parseFloat(price) * parseFloat(quantity),
    }));

  // Fetch initial snapshot
  const fetchInitialOrderBook = async () => {
    try {
      const res = await axios.get(`https://api.binance.com/api/v3/depth`, {
        params: {
          symbol: symbol.toUpperCase(),
          // limit: limit,
        },
      });

      const bids = mapOrders(res.data.bids);
      const asks = mapOrders(res.data.asks);

      // Mid price from best bid & ask
      const bestBid = bids?.[0]?.price || 0;
      const bestAsk = asks?.[0]?.price || 0;
      const midPrice = (bestBid + bestAsk) / 2;

      setLastPrice(currentPrice);
      setCurrentPrice(midPrice);

      setOrderBook({
        bids,
        asks,
      });
    } catch (error) {
      console.error('Error fetching order book snapshot:', error);
    }
  };

  useEffect(() => {
    if (!symbol) return;

    fetchInitialOrderBook(); // Load initial snapshot

    const wsSymbol = symbol.toLowerCase();
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${wsSymbol}@depth`
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      const bids = data.b?.map(([price, quantity]: [string, string]) => ({
        price: parseFloat(price),
        amount: parseFloat(quantity),
        total: parseFloat(price) * parseFloat(quantity),
      })) || [];

      const asks = data.a?.map(([price, quantity]: [string, string]) => ({
        price: parseFloat(price),
        amount: parseFloat(quantity),
        total: parseFloat(price) * parseFloat(quantity),
      })) || [];

      // Mid price from best bid & ask
      const bestBid = bids?.[0]?.price || currentPrice;
      const bestAsk = asks?.[0]?.price || currentPrice;
      const midPrice = (bestBid + bestAsk) / 2;

      setLastPrice(currentPrice);
      setCurrentPrice(midPrice);

      // Combine with existing snapshot
      setOrderBook({
        bids,
        asks,
      });
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    return () => {
      ws.close();
    };
  }, [symbol]);

  return {
    orderBook,
    currentPrice,
    lastPrice,
  };
};

export default useOrderBook;

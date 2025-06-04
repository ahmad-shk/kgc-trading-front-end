import { useState, useEffect } from "react";
import axios from "axios";

interface Order {
  price: number;
  amount: number;
  total: number;
}

interface OrderBook {
  lastUpdateId: number;
  bids: [string, string][]; // array of [price, quantity]
  asks: [string, string][];
}

interface FetchCoinDataResult {
  currentPrice: number;
  lastPrice: number;
  error: Error | null;
}

const mapOrders = (orders: [string, string][]): Order[] =>
  orders.map(([price, quantity]) => ({
    price: parseFloat(price),
    amount: parseFloat(quantity),
    total: parseFloat(price) * parseFloat(quantity),
  }));

export const useFetchCoinData = (symbol: string): FetchCoinDataResult => {
  const [error, setError] = useState<Error | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [lastPrice, setLastPrice] = useState<number>(0);

  useEffect(() => {
    if (!symbol) return;

    const fetchData = async () => {
      try {
        const res = await axios.get<OrderBook>(
          `https://api.binance.com/api/v3/depth`,
          {
            params: {
              symbol: symbol.toUpperCase(),
            },
          }
        );
        const bids = mapOrders(res.data.bids);
        const asks = mapOrders(res.data.asks);
        const bestBid = bids?.[0]?.price || 0;
        const bestAsk = asks?.[0]?.price || 0;
        const midPrice = (bestBid + bestAsk) / 2;

        setLastPrice(currentPrice);
        setCurrentPrice(midPrice);
      } catch (err: any) {
        setError(err);
      }
    };

    fetchData();
  }, [symbol]);

  return { lastPrice, currentPrice, error };
};

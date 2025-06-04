import { useEffect, useState } from "react";
import axios from "axios";

interface Trade {
  price: number;
  amount: number;
  time: string;
  type: "buy" | "sell";
}

export function useMarketTrades(symbol: string) {
  const [trades, setTrades] = useState<Trade[]>([]);

  // Helper to format trade data
  const formatTrade = (price: string, quantity: string, time: number, isBuyerMaker: boolean): Trade => ({
    price: parseFloat(price),
    amount: parseFloat(quantity),
    time: new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }),
    type: isBuyerMaker ? "sell" : "buy",
  });

  // Fetch initial trades snapshot
  const fetchInitialTrades = async () => {
    try {
      const res = await axios.get(`https://api.binance.com/api/v3/trades`, {
        params: {
          symbol: symbol.toUpperCase(),
          limit: 133, // Same limit as you use in state
        },
      });

      const initialTrades: Trade[] = res.data.map((t: any) =>
        formatTrade(t.price, t.qty, t.time, t.isBuyerMaker)
      );

      setTrades(initialTrades.reverse()); // Reverse so latest is on top
    } catch (error) {
      console.error("Error fetching initial trades:", error);
    }
  };

  useEffect(() => {
    if (!symbol) return;

    fetchInitialTrades(); // Load snapshot first

    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@trade`);

    ws.onmessage = (event) => {
      const trade = JSON.parse(event.data);

      const tradeData: Trade = formatTrade(trade.p, trade.q, trade.T, trade.m);

      setTrades((prev) => [tradeData, ...prev].slice(0, 133)); // Keep latest 133 trades
    };

    return () => ws.close(); // Clean up on unmount
  }, [symbol]);

  return trades;
}

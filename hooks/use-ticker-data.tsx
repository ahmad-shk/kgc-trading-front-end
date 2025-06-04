import { useEffect, useState } from 'react';

const useTickerData = (symbol: string) => {
  const [ticker, setTicker] = useState<any>(null);

  useEffect(() => {
    const wsSymbol = symbol.toLowerCase();
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${wsSymbol}@ticker`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Map WS keys to REST API keys
      const mappedTicker = {
        symbol: data.s,
        priceChange: data.p,
        priceChangePercent: data.P,
        weightedAvgPrice: data.w,
        prevClosePrice: data.x,
        lastPrice: data.c,
        lastQty: data.Q,
        bidPrice: data.b,
        bidQty: data.B,
        askPrice: data.a,
        askQty: data.A,
        openPrice: data.o,
        highPrice: data.h,
        lowPrice: data.l,
        volume: data.v,
        quoteVolume: data.q,
        openTime: data.O,
        closeTime: data.C,
        firstId: data.F,
        lastId: data.L,
        count: data.n
      };

      setTicker(mappedTicker);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, [symbol]);

  return ticker;
};

export default useTickerData;

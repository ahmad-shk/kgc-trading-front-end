// import { updateMarketCoins } from '@/store/slices/binanceSlice';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

export interface Coin {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number; // pseudo market cap based on volume * price
  iconUrl: string;
}

const tradingPairs = [
  // USDT Pairs
  "BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT",
  "DOGEUSDT", "ADAUSDT", "DOTUSDT", "UNIUSDT", "LTCUSDT",
  "PEPEUSDT", "DOGSUSDT", "CKBUSDT", "FETUSDT", "FTMUSDT",
  "WIFUSDT", "AVAXUSDT", "TRXUSDT", "RUNEUSDT", "SEIUSDT",
  "AAVEUSDT", "STPTUSDT", "TAOUSDT", "ORDIUSDT", "TONUSDT",
  "SAGAUSDT", "NEARUSDT", "BOMEUSDT", "ZROUSDT", "EURUSDT",
  "ARBUSDT", "TWTUSDT", "PEOPLEUSDT", "ENAUSDT", "NOTUSDT",
  "TIAUSDT", "FLOKIUSDT", "SHIBUSDT", "LINKUSDT", "CRVUSDT",
  "WLDUSDT", "SUIUSDT", "BONKUSDT", "NEIROUSDT", "BCHUSDT",
  "TROYUSDT", "USDTTRY", "SUPERUSDT", "QUICKUSDT", "RAREUSDT",

  // Top BTC Pairs
  "ETHBTC", "BNBBTC", "SOLBTC", "XRPBTC", "DOGEBTC",
  "ADABTC", "AVAXBTC", "TRXBTC", "LINKBTC", "DOTBTC",

  // Top ETH Pairs
  "USDCETH", "WBTCETH", "SHIBETH", "UNIETH", "MATICETH",
  "LDOETH", "ARBETH", "AAVEETH",

  // Top USDC Pairs
  "BTCUSDC", "ETHUSDC", "SOLUSDC", "AVAXUSDC", "DOGEUSDC"
];



const useHotCoinsSocketOnly = () => {
  const dispatch = useDispatch();
  const [coinsMap, setCoinsMap] = useState<Map<string, Coin>>(new Map());

  useEffect(() => {
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // console.log('data', data);
      //Symbol and Event
      // e: "24hrTicker"
      // Event type – this is a 24-hour ticker update.

      // s: "ATAUSDT"
      // Symbol – the trading pair (ATA vs USDT).

      // Price Stats
      // p: "-0.00020000"
      // Price change over the last 24 hours.

      // P: "-0.375"
      // Price change percentage over the last 24 hours.

      // w: "0.05264520"
      // Weighted average price over the last 24 hours.

      // x: "0.05330000"
      // Previous day’s closing price.

      // c: "0.05310000"
      // Latest price (current close).

      // Q: "98.00000000"
      // Quantity of the last trade.

      // b: "0.05290000"
      // Best bid price (highest buy offer currently).

      // B: "148913.00000000"
      // Best bid quantity.

      // a: "0.05310000"
      // Best ask price (lowest sell offer currently).

      // A: "66652.00000000"
      // Best ask quantity.

      // Price Extremes
      // o: "0.05330000"
      // Open price 24 hours ago.

      // h: "0.05390000"
      // Highest price in the past 24 hours.

      // l: "0.05130000"
      // Lowest price in the past 24 hours.

      // const usdtPairss = data.filter((coin: any) => tradingPairsUSDT.includes(coin.s));
      const usdtPairs = data.filter((coin: any) => tradingPairs.includes(coin.s))
      // console.log('usdtPairs', usdtPairs);

      setCoinsMap((prevMap) => {
        const updatedMap = new Map(prevMap);

        usdtPairs.forEach((coin: any) => {
          const price = parseFloat(coin.c);
          const volume = parseFloat(coin.q); // 24h quote volume (usdt)
          const marketCap = volume * price; // pseudo cap (volume × price)
          let iconUrl = `/icon/`;
          if (`${coin.s}`.toLowerCase().endsWith('usdt')) {
            iconUrl += `${coin.s}`.toLowerCase().replace('usdt','') + '.png';
          } else if (`${coin.s}`.toLowerCase().endsWith('usdc')) {
            iconUrl += `${coin.s}`.toLowerCase().replace('usdc','') + '.png';
          } else if (`${coin.s}`.toLowerCase().endsWith('btc')) {
            iconUrl += `${coin.s}`.toLowerCase().replace('btc','') + '.png';
          } else if (`${coin.s}`.toLowerCase().endsWith('eth')) {
            iconUrl += `${coin.s}`.toLowerCase().replace('eth','') + '.png';
          }
          updatedMap.set(coin.s, {
            symbol: coin.s,
            price,
            change24h: parseFloat(coin.P),
            volume24h: volume,
            marketCap,
            iconUrl,
          });
        });

        // dispatch(updateMarketCoins(Array.from(updatedMap.values())));
        return updatedMap;
      });
    };

    ws.onerror = (err) => console.error('Socket error', err);
    ws.onclose = () => console.log('Socket closed');

    return () => ws.close();
  }, []);

  // Top 10 coins by 24h change %
  const topCoins = Array.from(coinsMap.values())
    .sort(
      (a, b) => Math.abs(b.change24h) - Math.abs(a.change24h)
    )
    .slice(0, 10);

  return topCoins;
};

export default useHotCoinsSocketOnly;

import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { updateLiveTicker } from '@/store/slices/binanceSlice';
import throttle from 'lodash/throttle';
import axios from 'axios';

const symbols_icons = ["STPTUSDT", "NEIROUSDT", "ZROUSDT", "RAREUSDT", "SAGAUSDT", "NOTUSDT", "PEOPLEUSDT", "TWTUSDT", "QUICKUSDT", "USDTTRY"];

export const useBinanceWebSocket = (symbols: string[]) => {
    const dispatch = useDispatch();

    // Use ref to store latest ticker data
    const latestDataRef = useRef<any>({});

    // Throttled dispatch function (updates every 300ms)
    const throttledDispatch = useRef(
        throttle(() => {
            Object.values(latestDataRef.current).forEach((data: any) => {
                dispatch(updateLiveTicker(data));
            });
        }, 300)
    ).current;

    // Helper to build icon URL
    const getIconUrl = (symbol: string) => {
        let iconUrl = `/icon/`;
        if (symbol.toLowerCase().endsWith('usdt')) {
            iconUrl += symbol.toLowerCase().replace('usdt', '') + '.png';
        } else if (symbol.toLowerCase().endsWith('usdc')) {
            iconUrl += symbol.toLowerCase().replace('usdc', '') + '.png';
        } else if (symbol.toLowerCase().endsWith('btc')) {
            iconUrl += symbol.toLowerCase().replace('btc', '') + '.png';
        } else if (symbol.toLowerCase().endsWith('eth')) {
            iconUrl += symbol.toLowerCase().replace('eth', '') + '.png';
        }
        if (symbols_icons.includes(symbol)) iconUrl = `/icon/coin.png`;
        return iconUrl;
    };

    // Fetch initial snapshot
    const fetchInitialData = async () => {
        try {
            for (const symbol of symbols) {
                const res = await axios.get(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
                const { s: sym, c: lastPrice, P: priceChangePercent, q: quoteVolume } = res.data;
                const marketCap = quoteVolume * lastPrice;
                const iconUrl = getIconUrl(sym);

                const tickerData = { symbol: sym, lastPrice, priceChangePercent, quoteVolume, marketCap, iconUrl };
                // Save to ref
                latestDataRef.current[sym] = tickerData;
                // Dispatch immediately for initial load
                dispatch(updateLiveTicker(tickerData));
            }
        } catch (error) {
            console.error('Error fetching initial data:', error);
        }
    };

    useEffect(() => {
        fetchInitialData(); // Call initial API fetch

        const streams = symbols.map(s => `${s.toLowerCase()}@ticker`).join('/');
        const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);

        ws.onmessage = (event) => {
            const parsed = JSON.parse(event.data);
            const data = parsed.data;
            const { s: symbol, c: lastPrice, P: priceChangePercent, q: quoteVolume } = data;
            const marketCap = quoteVolume * lastPrice;
            const iconUrl = getIconUrl(symbol);

            latestDataRef.current[symbol] = { symbol, lastPrice, priceChangePercent, quoteVolume, marketCap, iconUrl };
            throttledDispatch();
        };

        return () => {
            ws.close();
            throttledDispatch.cancel();
        };
    }, [symbols, dispatch, throttledDispatch]);
};

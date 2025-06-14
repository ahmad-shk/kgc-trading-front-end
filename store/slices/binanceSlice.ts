
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Coin {
    symbol: string;
    lastPrice: number;
    priceChangePercent: number;
    quoteVolume: number;
    marketCap: number;
    iconUrl: string;
}

interface TickerData {
    symbol: string;
    lastPrice: string;
    priceChangePercent: string;
    quoteVolume: string;
}

export interface balanceInnterface {
    bnb: string;
    usdt: string;
    allowance:string;
}

interface BinanceState {
    coins: Coin[];
    topGainers: Coin[];
    topLosers: Coin[];
    topVolume: Coin[];
    hotCoins: Coin[];
    loading: boolean;
    userBalance:balanceInnterface | null
    error: string | null;
    symbol: string;
}

const initialState: BinanceState = {
    coins: [],
    topGainers: [],
    topLosers: [],
    topVolume: [],
    hotCoins: [],
    loading: false,
    error: null,
    userBalance:null,
    symbol: 'BNBUSDT',
};

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

export const fetchTopUsdtCoins = createAsyncThunk('coins/fetchTopUsdtCoins', async () => {
    const response = await axios.get<TickerData[]>('https://api.binance.com/api/v3/ticker/24hr');
    return response.data
        .filter((coin) => tradingPairs.includes(coin.symbol))
        .map((coin) => ({
            symbol: coin.symbol,
            lastPrice: parseFloat(coin.lastPrice),
            priceChangePercent: parseFloat(coin.priceChangePercent),
            quoteVolume: parseFloat(coin.quoteVolume),
            marketCap: parseFloat(coin.quoteVolume) * parseFloat(coin.lastPrice), // pseudo market cap based on volume * price
            iconUrl: `/icon/coin.png`
        }))
});

const binanceSlice = createSlice({
    name: 'binance',
    initialState,
    reducers: {
        setBinanceSymbol: (state, action: PayloadAction<string>) => {
            console.log('Setting Binance symbol:', action.payload);
            state.symbol = action.payload;
        },

        updateLiveTicker: (state, action: PayloadAction<Coin>) => {
            const existingCoin = state.coins.filter((coin) => coin.symbol != action.payload.symbol);
            const newList = [...existingCoin, action.payload].sort((a, b) => b.quoteVolume - a.quoteVolume)
            state.coins = newList;
            state.topGainers = newList.sort((a, b) => b.priceChangePercent - a.priceChangePercent)
                .filter((item: Coin) => (item.symbol.toLowerCase().endsWith('usdt'))).slice(0, 3);
            state.topLosers = newList.sort((a, b) => a.priceChangePercent - b.priceChangePercent)
                .filter((item: Coin) => (item.symbol.toLowerCase().endsWith('usdt'))).slice(0, 3)
            state.topVolume = newList.sort((a, b) => b.quoteVolume - a.quoteVolume)
                .filter((item: Coin) => (item.symbol.toLowerCase().endsWith('usdt'))).slice(0, 3)
            state.hotCoins = newList.sort((a, b) => Math.abs(b.priceChangePercent) - Math.abs(a.priceChangePercent))
                .filter((item: Coin) => (item.symbol.toLowerCase().endsWith('usdt'))).slice(0, 3)

        },

        setUserBalance: (state, action: PayloadAction<balanceInnterface>) => {
            state.userBalance = action.payload
        }
    },


    extraReducers: (builder) => {
        builder
            .addCase(fetchTopUsdtCoins.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTopUsdtCoins.fulfilled, (state, action) => {
                const coinList = action.payload
                state.topGainers = coinList.sort((a, b) => b.priceChangePercent - a.priceChangePercent)
                    .filter((item: Coin) => (item.symbol.toLowerCase().endsWith('usdt'))).slice(0, 3);
                state.topLosers = coinList.sort((a, b) => a.priceChangePercent - b.priceChangePercent)
                    .filter((item: Coin) => (item.symbol.toLowerCase().endsWith('usdt'))).slice(0, 3)
                state.topVolume = coinList.sort((a, b) => b.quoteVolume - a.quoteVolume)
                    .filter((item: Coin) => (item.symbol.toLowerCase().endsWith('usdt'))).slice(0, 3)
                state.hotCoins = coinList.sort((a, b) => Math.abs(b.priceChangePercent) - Math.abs(a.priceChangePercent))
                    .filter((item: Coin) => (item.symbol.toLowerCase().endsWith('usdt'))).slice(0, 3)

                state.loading = false;
            })
            .addCase(fetchTopUsdtCoins.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Something went wrong';
            });
    },
});

export const { setBinanceSymbol, updateLiveTicker, setUserBalance } = binanceSlice.actions;
export default binanceSlice.reducer;
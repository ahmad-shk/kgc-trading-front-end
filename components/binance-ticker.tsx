// components/BinanceTicker.tsx
"use client";

import { useEffect, useState } from "react";
import useTickerData from "@/hooks/use-ticker-data";
import { useSelector } from "react-redux";


export default function BinanceTicker() {
    const symbol = useSelector((state: any) => state.binance.symbol);
    const ticker = useTickerData(symbol);
    const [tickerName, setTickerName] = useState<string>('BTC');
    const [tickerBy, setTickerBy] = useState<string>('USDT');
    const [priceChangeColor, setPriceChangeColor] = useState<string>("text-green-500");

    // const priceChangeColor = data.priceChange >= 0 ? "text-green-500" : "text-red-500";
    useEffect(() => {
        if (`${symbol}`.endsWith('USDT')) {
            setTickerName(symbol.replace('USDT', ''))
            setTickerBy('USDT')
        } else if (`${symbol}`.endsWith('USDC')) {
            setTickerName(symbol.replace('USDC', ''))
            setTickerBy('USDC')
        } else if (`${symbol}`.endsWith('BTC')) {
            setTickerName(symbol.replace('BTC', ''))
            setTickerBy('BTC')
        } else if (`${symbol}`.endsWith('ETH')) {
            setTickerName(symbol.replace('ETH', ''))
            setTickerBy('ETH')
        }
         if (!ticker) return;
        setPriceChangeColor(ticker.priceChange >= 0 ? "text-green-500" : "text-red-500");
    }, [symbol]);




    // if (!ticker) return <div>Loading...</div>;

    return (

        <div className="hide-scrollbar w-full rounded-2xl p-3 -border -border-gray-800 bg-[#181A20] overflow-x-scroll">
            {
                !ticker ? <div className="flex items-center justify-between text-white text-sm min-w-[1000px] gap-8">Loading...</div> :

                    <div className="flex items-center justify-between text-white text-sm min-w-[1000px] gap-8">
                        <div className="flex items-center gap-1">
                            <div className="flex flex-col">
                                <span className="text-[#edb546] text-base font-semibold text-[18px]">
                                    {`${tickerName}/${tickerBy}`}
                                    </span>
                                <span className="text-[#edb546] text-[14px]">{`${tickerName} Price`}</span>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            {ticker?.lastPrice
                                ? parseFloat(ticker.lastPrice).toLocaleString(undefined, { maximumFractionDigits: 6 })
                                : '0'}
                            <span className="text-[#edb546] text-xs">$
                             {ticker?.lastPrice
                                ? parseFloat(ticker.lastPrice).toLocaleString(undefined, { maximumFractionDigits: 6 })
                                : '0'}
                            </span>
                        </div>

                        <div className="flex flex-col">
                            <span className=" text-xs text-[#848E9C]">24h Change</span>
                            <span className={`${priceChangeColor} text-xs`}>
                                {`${parseFloat(ticker.priceChange).toFixed(2)} ${ticker.priceChange >= 0 ? '+' : ''}${parseFloat(ticker.priceChangePercent).toFixed(2)}%`}
                            </span>
                        </div>

                        <div className="flex flex-col">
                            <span className=" text-xs text-[#848E9C]">24h High</span>
                            <span className="text-[#edb546] text-xs">{parseFloat(ticker.highPrice).toFixed(2)}</span>
                        </div>

                        <div className="flex flex-col">
                            <span className=" text-xs text-[#848E9C]">24h Low</span>
                            <span className="text-[#edb546] text-xs">{parseFloat(ticker.lowPrice).toFixed(2)}</span>
                        </div>

                        <div className="flex flex-col">
                            <span className=" text-xs text-[#848E9C]">24h Volume ({tickerName})</span>
                            <span className="text-[#edb546] text-xs">{(parseFloat(ticker.quoteVolume) / parseFloat(ticker?.lastPrice)).toFixed(2)}</span>
                        </div>

                        <div className="flex flex-col">
                            <span className=" text-xs text-[#848E9C]">24h Volume ({tickerBy})</span>
                            <span className="text-[#edb546] text-xs">{(parseFloat(ticker.quoteVolume)).toFixed(2)}</span>
                        </div>

                        <div className="flex flex-col">
                            <span className=" text-xs text-[#848E9C]">Token Tags</span>
                            <span className="text-[#edb546] text-xs">Layer 1 / Layer 2 | BND Chain | Voll Hot</span>
                        </div>
                    </div>
            }
        </div>
    );
}
import React from 'react';
import { ArrowUpDown } from "lucide-react";
import TokenRow from "@/components/tokenRow";
import { useSelector } from 'react-redux';

const BinanceCryptoTable = () => {
    const { coins } = useSelector((state: any) => state.binance);
    if (!coins) return <p>Loading...</p>;

    return (
        <div className="pb-4 w-full overflow-x-auto">
            <h2 className="text-xl text-[#EDB546] font-bold mb-4 -text-center">Top Cryptos (Binance)</h2>
            <table className="min-w-[700px] w-full table-fixed text-center">
                <thead>
                    <tr className="text-[#EDB546] text-sm">
                        {["Name", "Price", "24h", "24h Volume", "Market Cap", "Action"].map((header) => (
                            <th key={header} className="py-4 px-4 font-semibold text-center whitespace-nowrap">
                                <div className="flex items-center justify-center">
                                    {header} {header !== "Action" && <ArrowUpDown className="h-4 w-4 ml-1" />}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {coins
                        .filter((item: any) => item.symbol.toLowerCase().endsWith('usdt'))
                        .filter(({ quoteVolume }: any) => quoteVolume > 1.0)
                        .sort((a: any, b: any) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume))
                        .map((coin: any, index: number) => (
                            <TokenRow
                                key={index}
                                coin={coin.symbol}
                                img={coin.iconUrl}
                                price={`${parseFloat(coin.lastPrice).toLocaleString(undefined, { maximumFractionDigits: 6 })}`}
                                change={`${parseFloat(coin.priceChangePercent).toFixed(2)}%`}
                                volume={`${parseFloat(coin.quoteVolume).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                                marketCap={`${parseFloat(coin.marketCap).toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
                                arrow={'/Frame.png'}
                            />
                        ))}
                </tbody>
            </table>
        </div>
    );
};

export default BinanceCryptoTable;

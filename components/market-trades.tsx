"use client";

import { useEffect, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { useMarketTrades } from "@/hooks/use-market-trades-data";
import { useAccount } from "@/config/context/AccountContext";

const tabs = [
  { id: "market", label: "Market Trades" },
  // { id: "my", label: "My Trades" },
];

export default function MarketTrades() {
  const [activeTab, setActiveTab] = useState("market");
  const {symbol} = useSelector((state: any) => state.binance);
  const trades = useMarketTrades(symbol);
  const [teckerName, setTeckerName] = useState('USDT');
  const { isConnected } = useAccount();


  useEffect(() => {
    if (!symbol) return;
    if (symbol.endsWith('USDT')) {
      setTeckerName(symbol.replace('USDT', ''))
    } else if (symbol.endsWith('USDC')) {
      setTeckerName(symbol.replace('USDC', ''))
    } else if (symbol.endsWith('BTC')) {
      setTeckerName(symbol.replace('BTC', ''))
    } else if (symbol.endsWith('ETH')) {
      setTeckerName(symbol.replace('ETH', ''))
    }

  }, [symbol]);

  return (
    <div className="flex flex-col h-[350px] -bg-transparent bg-[#181A20] -border -border-[#1f2128] rounded-2xl overflow-hidden">
      {/* Tabs Header */}
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="flex gap-6 text-sm font-semibold">
          {tabs.map((tab) => 
          {
            if (!isConnected && tab.id === "my") {
              return null; // Hide "My Trades" tab if not connected
            }
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex justify-center
                  ${activeTab === tab.id
                    ? "text-[#EDB546] before:content-[''] before:absolute before:bottom-0 before:h-[2px] before:w-[20px] before:bg-[#EDB546]"
                    : "text-[#8e8e8e]"
                  } transition-colors duration-200`}
              >
                {tab.label}
              </button>
            ) 
          }
          )}
        </div>

        <button className="text-[#8e8e8e] hover:text-white transition-colors duration-200">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Divider */}
      <div className="border-b border-[#2B3139]" />

      {/* Table Header */}
      <div className="py-2 px-4 flex justify-between text-[12px] font-semibold text-[#848E9C] -text-white/60">
        <div>{`Price (USDT)`}</div>
        <div className="w-[100px]">{`Amount (${teckerName})`}</div>
        <div>Time</div>
      </div>

      {/* Trades List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {trades.map((trade: any, index) => (
          <div
            key={index}
            className="flex justify-between items-center px-4 py-1.5 text-[10px]  hover:bg-[#1f2128]/30 transition"
          >
            <div className={trade?.type === "buy" ? "text-green-500" : "text-red-500"}>
              {/* {trade.type === "buy" ? "+1.03%" : "-1.03%"} */}
              {trade?.price}
            </div>
            <div className="text-[#EDB546]">{trade?.amount.toFixed(3)}</div>
            <div className="text-[#EDB546]">{trade?.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

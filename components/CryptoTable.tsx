"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBinanceSymbol } from "@/store/slices/binanceSlice";

// interface Coin {
//   iconUrl: string;
//   name: string;
//   lastPrice: number;
//   secondPrice: number;
//   change: number;
// }


interface Coin {
  symbol: string;
  lastPrice: number;
  priceChangePercent: number;
  quoteVolume: number;
  marketCap: number;
  iconUrl: string;
}

export default function CryptoTable() {

  const { coins } = useSelector((state: any) => state.binance);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("New");
  const dispatch = useDispatch();

  return (
    <div className="rounded-lg w-full text-[#848E9C] -text-white">
      {/* Search */}
      <div className="flex items-center bg-transparent px-4 py-2 rounded-[6px] mb-4 border-2 border-gray-800">
        <span className="text-[#f0b90b] mr-2 text-lg">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.6355 15.3927L12.7529 11.2775C13.7512 10.0681 14.2982 8.54645 14.2982 6.96234C14.2982 3.26121 11.3434 0.25 7.71158 0.25C4.0798 0.25 1.125 3.26121 1.125 6.96234C1.125 10.6635 4.0798 13.6747 7.71158 13.6747C9.075 13.6747 10.3743 13.2556 11.4851 12.46L15.3973 16.6065C15.5608 16.7796 15.7807 16.875 16.0164 16.875C16.2395 16.875 16.4511 16.7883 16.6118 16.6307C16.9531 16.296 16.964 15.7409 16.6355 15.3927ZM7.71158 2.00104C10.396 2.00104 12.5799 4.22662 12.5799 6.96234C12.5799 9.69805 10.396 11.9236 7.71158 11.9236C5.02712 11.9236 2.84324 9.69805 2.84324 6.96234C2.84324 4.22662 5.02712 2.00104 7.71158 2.00104Z" fill="#EDB546" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent outline-none text-sm placeholder-white placeholder:text-[12px] flex-1"
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-[#2B3139]">
        <button
          onClick={() => setActiveTab("New")}
          className={`px-3 py-2 text-sm ${activeTab === "New" ? "text-[#f0b90b] font-bold border-b-2 border-[#f0b90b]" : "text-[#848e9c]"}`}
        >
          New
        </button>
        <button
          onClick={() => setActiveTab("USDT")}
          className={`px-3 py-2 text-sm ${activeTab === "USDT" ? "text-[#f0b90b] font-bold border-b-2 border-[#f0b90b]" : "text-[#848e9c]"}`}
        >
          USDT
        </button>
        <button
          onClick={() => setActiveTab("BTC")}
          className={`px-3 py-2 text-sm ${activeTab === "BTC" ? "text-[#f0b90b] font-bold border-b-2 border-[#f0b90b]" : "text-[#848e9c]"}`}
        >
          BTC
        </button>
        <button
          onClick={() => setActiveTab("ETH")}
          className={`px-3 py-2 text-sm ${activeTab === "ETH" ? "text-[#f0b90b] font-bold border-b-2 border-[#f0b90b]" : "text-[#848e9c]"}`}
        >
          ETH
        </button>
        <button
          onClick={() => setActiveTab("USDC")}
          className={`px-3 py-2 text-sm ${activeTab === "USDC" ? "text-[#f0b90b] font-bold border-b-2 border-[#f0b90b]" : "text-[#848e9c]"}`}
        >
          USDC
        </button>
      </div>

      {/* Table Header */}
      <div className="flex justify-between text-[11px] px-2 py-2">
        <span>Coin</span>
        <span>Last Price</span>
        <span>24h Changes</span>
      </div>

      {/* Table Rows */}
      <div className="cursor-pointer max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-[#848e9c]/30 scrollbar-track-transparent">
        {coins
          .filter((item: Coin) => {
            if (activeTab === "New") return item
            else return item.symbol.toLowerCase().endsWith(activeTab.toLowerCase());
          })
          .filter((item: Coin) => (item.symbol.toLowerCase().includes(search.toLowerCase())))
          .map((coin: Coin, index: number) => (
            <div key={index} className="flex justify-between items-center text-sm py-2 px-2"
              onClick={() => { dispatch(setBinanceSymbol(coin.symbol)) }}
            >
              {/* Coin */}
              <div className="flex items-center gap-2">
                <img src={coin.iconUrl} alt={coin.symbol} className="w-5 h-5" />
                <span>{coin.symbol}</span>
              </div>

              {/* Price */}
              <div className="flex flex-col items-end text-xs">
                <span className="text-[#eaecef]">{coin.lastPrice}</span>
                <span className="text-[#848e9c] text-[10px]">${coin.lastPrice}</span>
              </div>

              {/* 24h Change */}
              <span className={`text-xs ${coin.priceChangePercent >= 0 ? "text-[#0ecb81]" : "text-[#f6465d]"}`}>
                {coin.priceChangePercent >= 0 ? `+${coin.priceChangePercent}%` : `${coin.priceChangePercent}%`}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
"use client"

import { useState } from "react"
import { MoreHorizontal } from "lucide-react"

export default function TradingView() {
  const [activeTab, setActiveTab] = useState("coin")

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#1f2128]">
        <h3 className="font-medium text-xs">Trading View</h3>
        <button className="text-[#6f6a6b] hover:text-white">
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-4 px-3 py-1 text-[10px] text-[#6f6a6b] border-b border-[#1f2128]">
        <div>Coin</div>
        <div>Last Price</div>
        <div>24h Changes</div>
        <div></div>
      </div>

      <div className="flex-1 overflow-auto">
        {[
          { coin: "BNB", price: 0.2074, change: "+1.03%", icon: "🟡" },
          { coin: "ETH", price: 0.1641, change: "+11.00%", icon: "🔵" },
          { coin: "BTC", price: 0.3867, change: "+5.03%", icon: "🟠" },
          { coin: "BNB", price: 0.2074, change: "+1.03%", icon: "🟡" },
          { coin: "ETH", price: 0.1641, change: "+11.00%", icon: "🔵" },
        ].map((item, i) => (
          <div
            key={i}
            className="grid grid-cols-4 px-3 py-1 text-[10px] border-b border-[#1f2128]/50 hover:bg-[#1f2128]/50"
          >
            <div className="flex items-center gap-1">
              <span className="text-[9px]">{item.icon}</span>
              <span>{item.coin}</span>
            </div>
            <div>${item.price.toFixed(4)}</div>
            <div className="text-[#15b34c]">{item.change}</div>
            <div className="text-right">$5.20/4000</div>
          </div>
        ))}
      </div>
    </div>
  )
}

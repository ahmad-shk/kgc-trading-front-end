"use client"

import { useState } from "react"

export default function BuySellPanel() {
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy")
  const [sliderValue, setSliderValue] = useState(20)

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-2 border-b border-[#1f2128]">
        <button
          className={`py-2 font-medium text-xs ${activeTab === "buy" ? "text-[#15b34c] border-b-2 border-[#15b34c]" : "text-[#6f6a6b]"}`}
          onClick={() => setActiveTab("buy")}
        >
          Buy Long
        </button>
        <button
          className={`py-2 font-medium text-xs ${activeTab === "sell" ? "text-[#f6465d] border-b-2 border-[#f6465d]" : "text-[#6f6a6b]"}`}
          onClick={() => setActiveTab("sell")}
        >
          Sell Short
        </button>
      </div>

      <div className="px-3 py-1.5 border-b border-[#1f2128]">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[#6f6a6b]">Balance: 0.00 USDT</span>
        </div>
      </div>

      <div className="p-2.5 grid gap-2.5">
        <div>
          <div className="flex justify-between mb-0.5">
            <label className="text-[10px] text-[#6f6a6b]">Price</label>
            <div className="text-[10px]">596.54 USDT</div>
          </div>
          <div className="relative">
            <input
              type="text"
              value="596.54 USDT"
              className="w-full bg-[#1f2128] border border-[#1f2128] rounded p-1 text-[10px] text-white"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <button className="text-[#edb546] text-[10px]">▼</button>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-0.5">
            <label className="text-[10px] text-[#6f6a6b]">Amount</label>
            <div className="text-[10px]">596.54 BNB</div>
          </div>
          <div className="relative">
            <input
              type="text"
              value="596.54 BNB"
              className="w-full bg-[#1f2128] border border-[#1f2128] rounded p-1 text-[10px] text-white"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <button className="text-[#edb546] text-[10px]">▼</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-1 my-1.5">
          {[20, 30, 40, 50, 60].map((value) => (
            <button
              key={value}
              className={`text-[9px] py-0.5 rounded ${sliderValue === value ? "bg-[#1f2128]/80 text-white" : "text-[#6f6a6b]"}`}
              onClick={() => setSliderValue(value)}
            >
              {value}%
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 mt-1.5">
          <div>
            <div className="flex justify-between mb-0.5">
              <label className="text-[9px] text-[#6f6a6b]">AVBL</label>
              <div className="text-[9px]">-- USDT</div>
            </div>
            <div className="flex justify-between mb-0.5">
              <label className="text-[9px] text-[#6f6a6b]">Max Buy</label>
              <div className="text-[9px]">-- BNB</div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-0.5">
              <label className="text-[9px] text-[#6f6a6b]">AVBL</label>
              <div className="text-[9px]">-- BNB</div>
            </div>
            <div className="flex justify-between mb-0.5">
              <label className="text-[9px] text-[#6f6a6b]">Min Buy</label>
              <div className="text-[9px]">-- BNB</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-2">
          <button className="bg-[#15b34c] hover:bg-[#15b34c]/90 text-white font-medium py-1.5 rounded text-[10px]">
            Buy
          </button>
          <button className="bg-[#f6465d] hover:bg-[#f6465d]/90 text-white font-medium py-1.5 rounded text-[10px]">
            Sell
          </button>
        </div>
      </div>
    </div>
  )
}

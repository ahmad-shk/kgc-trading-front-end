"use client"

import { useState } from "react"
import { Maximize2, Settings } from "lucide-react"
import TradingViewWidget from "@/components/charts/TradingViewWidget"


export default function TradingChart() {
  const [timeframe, setTimeframe] = useState("Charts")
  const timeframes = ["Charts"]

  return (
    <div className="w-full max-w-6xl rounded-2xl bg-[#181A20] -border -border-gray-700 text-white p-2 mx-auto h-full flex flex-col ">
      <div className="flex items-center justify-between px-2 py-1 border-b border-[#1f2128]">
        <div className="flex items-center gap-1">
          <div className="flex">
            {timeframes.map((tf) => (
              <button
                key={tf}
                className={`px-1.5 py-0.5 text-[9px] ${timeframe === tf ? "bg-[#1f2128] text-white" : "text-[#6f6a6b]"}`}
                onClick={() => setTimeframe(tf)}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button className="text-[#6f6a6b] hover:text-white">
            <Settings className="h-3 w-3" />
          </button>
          <button className="text-[#6f6a6b] hover:text-white">
            <Maximize2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="flex-1 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full -bg-gradient-to-b from-[#f6465d]/5 to-[#15b34c]/5 relative -overflow-hidden">
            <TradingViewWidget />
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"

export default function OrderTabs() {
  const [activeTab, setActiveTab] = useState("open")

  return (
    <div className="h-full flex flex-col">
      <div className="flex border-b border-[#1f2128]">
        <button
          className={`px-3 py-2 text-[10px] font-medium ${activeTab === "open" ? "text-[#edb546] border-b-2 border-[#edb546]" : "text-[#6f6a6b]"}`}
          onClick={() => setActiveTab("open")}
        >
          Open Order (0)
        </button>
        <button
          className={`px-3 py-2 text-[10px] font-medium ${activeTab === "order" ? "text-[#6f6a6b] border-b-2 border-transparent" : "text-[#6f6a6b]"}`}
          onClick={() => setActiveTab("order")}
        >
          Order History
        </button>
        <button
          className={`px-3 py-2 text-[10px] font-medium ${activeTab === "trade" ? "text-[#6f6a6b] border-b-2 border-transparent" : "text-[#6f6a6b]"}`}
          onClick={() => setActiveTab("trade")}
        >
          Trade History
        </button>
        <button
          className={`px-3 py-2 text-[10px] font-medium ${activeTab === "funds" ? "text-[#6f6a6b] border-b-2 border-transparent" : "text-[#6f6a6b]"}`}
          onClick={() => setActiveTab("funds")}
        >
          Funds
        </button>
      </div>

      <div className="p-4 flex items-center justify-center text-[#6f6a6b] text-[10px]">No open orders</div>
    </div>
  )
}

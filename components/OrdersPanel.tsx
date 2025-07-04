"use client"
import { useAccount } from "@/config/context/AccountContext"
import { useAppKit } from "@reown/appkit/react"
import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchOrders } from "@/store/slices/orderSlice"
import type { AppDispatch, RootState } from "@/store/store"
import { fetchPool, fetchResultsByUser } from "@/store/slices/poolSlice"
import CountdownTimer from "./countdownTimer"
import { Copy, ExternalLink } from "lucide-react"

interface Order {
  _id: string
  symbol: string
  amount: number
  leverage: number
  order_type: string
  status:
    | "LOSER"
    | "WINNER"
    | "DRAW"
    | "PROCESSING"
    | "INPROGRESS"
    | "Order History"
    | "Trade History"
    | "PENDING"
    | "COMPLETE"
    | "OPEN"
  createdAt: string
  transactionHash?: string
}

const tabs = ["Open Order", "Order History", "Trade History", "Pool", "Funds"]

const OrdersPanel: React.FC = () => {
  const { userBalance } = useSelector((state: any) => state.binance)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const { orders } = useSelector((state: RootState) => state.order)
  const { pool, orderRresults } = useSelector((state: RootState) => state.pool)
  const { isConnected, address } = useAccount()
  const { open } = useAppKit()
  const [data, setData] = useState<Order[]>([])
  const [poolData, setPoolData] = useState<Order[]>([])
  const [activeTab, setActiveTab] = useState("Open Order")
  const dispatch = useDispatch<AppDispatch>()
  const [copied, setCopied] = useState(false)
  const [fundsData, setFundsData] = useState([
    { symbol: "USDT", amount: "0" },
    { symbol: "BNB", amount: "0" },
  ])

  useEffect(() => {
    if (userBalance) {
      setFundsData([
        { symbol: "USDT", amount: userBalance.usdt },
        { symbol: "BNB", amount: userBalance.bnb },
      ])
    }
  }, [userBalance])

  useEffect(() => {
    if (!isConnected) return
    const fetch = () => {
      dispatch(fetchOrders())
      dispatch(fetchResultsByUser())
    }
    fetch()
    const now = new Date()
    const msPastHour = now.getMinutes() * 60 * 1000 + now.getSeconds() * 1000 + now.getMilliseconds()
    const msUntilNext5Min = 5 * 60 * 1000 - (msPastHour % (5 * 60 * 1000))
    const nextRun = new Date(Date.now() + msUntilNext5Min)
    console.log("Next fetch scheduled at:", nextRun.toLocaleTimeString())
    const timeoutId = setTimeout(() => {
      fetch()
      intervalRef.current = setInterval(fetch, 5 * 60 * 1000)
    }, msUntilNext5Min + 10000)
    return () => {
      clearTimeout(timeoutId)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isConnected, dispatch])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!isConnected || !token) return
    dispatch(fetchPool())
    const interval = setInterval(() => {
      dispatch(fetchPool())
    }, 10000)
    return () => clearInterval(interval)
  }, [isConnected, dispatch])

  useEffect(() => {
    if (orders) setData(orders)
  }, [orders])

  useEffect(() => {
    if (pool) setPoolData(pool)
  }, [pool])



  const getActiveData = () => {
    if (!data) return []
    const sortByDate = <T extends { createdAt?: string }>(arr: T[]): T[] => {
      return [...arr].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    }
    switch (activeTab) {
      case "Open Order": {
        const openOrders = data.filter((order) => order.status === "PENDING" || order.status === "PROCESSING")
        return sortByDate(openOrders)
      }
      case "Order History": {
        const orderHistory = data.filter(
          (order) => order.status === "LOSER" || order.status === "WINNER" || order.status === "DRAW",
        )
        return sortByDate(orderHistory)
      }
      case "Trade History":
        return orderRresults
      case "Pool":
        // poolData has no createdAt field
        return poolData;

      case "Funds":
        return fundsData
      default:
        return sortByDate(data)
    }
  }


  // console.log('orderRresults-->', orderRresults)
  const getTabCount = (tab: string) => {
    switch (tab) {
      case "Open Order":
        return data.filter(
          (order) =>
            order.status.toLocaleLowerCase() === "PENDING".toLocaleLowerCase() ||
            order.status.toLocaleLowerCase() === "PROCESSING".toLocaleLowerCase(),
        ).length
      case "Order History":
        return data.filter(
          (order) =>
            order.status.toLocaleLowerCase() === "LOSER".toLocaleLowerCase() ||
            order.status.toLocaleLowerCase() === "WINNER".toLocaleLowerCase() ||
            order.status.toLocaleLowerCase() === "DRAW".toLocaleLowerCase(),
        ).length
      case "Trade History":
        return orderRresults.length
      case "Pool":
        return poolData.length
      case "Funds":
        return fundsData.length
      default:
        return 0
    }
  }

  useEffect(() => {
    if (!isConnected) {
      setData([])
      setPoolData([])
    }
  }, [isConnected])

  const handleCopy = async (hash: string) => {
    try {
      await navigator.clipboard.writeText(hash)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error("Failed to copy hash:", err)
    }
  }

  const renderMobileCard = (item: any, index: number) => {
    const cardColor = index % 2 === 0 ? "text-[#EDB546]" : "text-[#d4b26f]"

    return (
      <div key={item?._id || index} className="bg-[#1F2128] rounded-lg p-4 mb-3 border border-gray-700">
        {activeTab === "Open Order" && (
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-xs text-[#848E9C]">Order ID</span>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${cardColor} max-w-[120px] truncate`}>{item?._id}</span>
                <Copy
                  size={14}
                  className="text-[#848E9C] cursor-pointer hover:text-[#EDB546]"
                  onClick={() => handleCopy(item?._id)}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-[#848E9C]">Symbol</span>
              <span className={`text-sm font-medium ${cardColor}`}>{item?.symbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-[#848E9C]">Type</span>
              <span className={`text-sm font-medium ${cardColor}`}>{item?.order_type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-[#848E9C]">Amount</span>
              <span className={`text-sm font-medium ${cardColor}`}>{item?.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-[#848E9C]">Leverage</span>
              <span className={`text-sm font-medium ${cardColor}`}>{item?.leverage}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-[#848E9C]">Status</span>
              <span className={`text-sm font-medium ${cardColor}`}>{item?.status}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#848E9C]">Transaction</span>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${cardColor}`}>
                  {item?.transactionHash
                    ? `${item?.transactionHash.slice(0, 6)}...${item?.transactionHash.slice(-4)}`
                    : "Claim"}
                </span>
                {item?.transactionHash && (
                  <ExternalLink
                    size={14}
                    className="text-[#848E9C] cursor-pointer hover:text-[#EDB546]"
                    onClick={() =>
                      window.open(
                        `https://testnet.bscscan.com/tx/${item?.transactionHash}`,
                        "_blank",
                        "noopener,noreferrer",
                      )
                    }
                  />
                )}
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-[#848E9C]">Created</span>
              <span className={`text-sm font-medium ${cardColor}`}>
                {new Date(item?.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}

        {activeTab === "Order History" && (
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-xs text-[#848E9C]">Order ID</span>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${cardColor} max-w-[120px] truncate`}>{item?._id}</span>
                <Copy
                  size={14}
                  className="text-[#848E9C] cursor-pointer hover:text-[#EDB546]"
                  onClick={() => handleCopy(item?._id)}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-[#848E9C]">Symbol</span>
              <span className={`text-sm font-medium ${cardColor}`}>{item?.symbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-[#848E9C]">Type</span>
              <span className={`text-sm font-medium ${cardColor}`}>{item?.order_type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-[#848E9C]">Amount</span>
              <span className={`text-sm font-medium ${cardColor}`}>{item?.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-[#848E9C]">Leverage</span>
              <span className={`text-sm font-medium ${cardColor}`}>{item?.leverage}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-[#848E9C]">Status</span>
              <span className={`text-sm font-medium ${cardColor}`}>{item?.status}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#848E9C]">Transaction</span>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${cardColor}`}>
                  {item?.transactionHash
                    ? `${item?.transactionHash.slice(0, 6)}...${item?.transactionHash.slice(-4)}`
                    : "Claim"}
                </span>
                {item?.transactionHash && (
                  <ExternalLink
                    size={14}
                    className="text-[#848E9C] cursor-pointer hover:text-[#EDB546]"
                    onClick={() =>
                      window.open(
                        `https://testnet.bscscan.com/tx/${item?.transactionHash}`,
                        "_blank",
                        "noopener,noreferrer",
                      )
                    }
                  />
                )}
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-[#848E9C]">Created</span>
              <span className={`text-sm font-medium ${cardColor}`}>
                {new Date(item?.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}

        {activeTab === "Trade History" && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-[#848E9C]">Order ID</span>
              <span className={`text-sm font-medium ${cardColor}`}>{item?.order_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-[#848E9C]">Symbol</span>
              <span className={`text-sm font-medium ${cardColor}`}>{item?.symbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-[#848E9C]">Amount</span>
              <span className={`text-sm font-medium ${cardColor}`}>{item?.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-[#848E9C]">Claimable</span>
              <span className={`text-sm font-medium ${cardColor}`}>{item?.calimable_amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-[#848E9C]">PnL</span>
              <span className={`text-sm font-medium ${cardColor}`}>{item?.profit_loss}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-[#848E9C]">Status</span>
              <span className={`text-sm font-medium ${cardColor}`}>{item?.status}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#848E9C]">Transaction</span>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${cardColor}`}>
                  {item?.transactionHash
                    ? `${item?.transactionHash.slice(0, 6)}...${item?.transactionHash.slice(-4)}`
                    : "Claim"}
                </span>
                {item?.transactionHash && (
                  <ExternalLink
                    size={14}
                    className="text-[#848E9C] cursor-pointer hover:text-[#EDB546]"
                    onClick={() =>
                      window.open(
                        `https://testnet.bscscan.com/tx/${item?.transactionHash}`,
                        "_blank",
                        "noopener,noreferrer",
                      )
                    }
                  />
                )}
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-[#848E9C]">Created</span>
              <span className={`text-sm font-medium ${cardColor}`}>
                {new Date(item?.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}

        {activeTab === "Pool" && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-[#848E9C]">Name</span>
              <span className={`text-sm font-medium ${cardColor}`}>{item?.symbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-[#848E9C]">Pool Type</span>
              <span className={`text-sm font-medium ${cardColor}`}>{item?.pool_type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-[#848E9C]">Status</span>
              <span className={`text-sm font-medium ${cardColor}`}>{item?.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-[#848E9C]">Order Count</span>
              <span className={`text-sm font-medium ${cardColor}`}>{item?.ordersCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-[#848E9C]">Start Time</span>
              <span className={`text-sm font-medium ${cardColor}`}>
                {new Date(item?.start_timestamps).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-[#848E9C]">Timer</span>
              <span className={`text-sm font-medium ${cardColor}`}>
                <CountdownTimer
                  startTimestamp={item?.status === "OPEN" ? item?.start_timestamps : item?.process_timestamps}
                />
              </span>
            </div>
          </div>
        )}

        {activeTab === "Funds" && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-[#848E9C]">Symbol</span>
              <span className={`text-sm font-medium ${cardColor}`}>{item?.symbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-[#848E9C]">Amount</span>
              <span className={`text-sm font-medium ${cardColor}`}>{item?.amount}</span>
            </div>
          </div>
        )}
      </div>
    )
  }










  return (
    <div className="bg-[#181A20] text-white p-2 sm:p-4 md:p-6 rounded-3xl border border-gray-800 min-h-[300px] sm:min-h-[250px] w-full">
      {/* Tabs Section */}
      <div 
      className="flex flex-wrap gap-2 sm:gap-2 md:gap-2 border-b border-[#2B3139] rounded-t-2xl pb-2 ml-2 sm:ml-2 md:ml-2 overflow-x-auto"
      >
        <div className="flex gap-2 sm:gap-4 md:gap-8 min-w-max px-2 sm:px-4 md:px-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                if (!isConnected) return
                setActiveTab((prev) => (prev === tab ? "" : tab))
              }}
              disabled={!isConnected}
              className={`relative px-1 sm:px-2 md:px-3 py-2 text-xs sm:text-sm md:text-base font-medium transition-all duration-300 whitespace-nowrap
                ${activeTab === tab ? "text-[#EDB546]" : "text-[#848E9C] hover:text-white"}
                cursor-pointer disabled:cursor-not-allowed`}
            >
              <span className="relative">
                <span className="hidden sm:inline">{`${tab} (${getTabCount(tab)})`}</span>
                <span className="sm:hidden">{`${tab.split(" ")[0]} (${getTabCount(tab)})`}</span>
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] w-full transition-all duration-300
                    ${activeTab === tab ? "bg-[#EDB546]" : "bg-transparent group-hover:bg-[#EDB546]"}`}
                ></span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {!isConnected ? (
        <div className="flex items-center justify-center h-full p-4 sm:p-8 md:p-20 text-center text-[#EDB546]">
          <p className="text-xs sm:text-sm md:text-base">
            <span className="underline cursor-pointer" onClick={() => open()}>
              Log in
            </span>
            <span className="text-[#848E9C]"> or </span>
            <span className="underline cursor-pointer">Register Now</span>
            <span className="text-[#848E9C]"> to trade</span>
          </p>
        </div>
      ) : (
        <div className="max-h-[300px] sm:max-h-[400px] md:max-h-[500px] overflow-y-auto">
          {getActiveData().length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <div className="overflow-x-auto">
                  <table className="w-full table-fixed min-w-[800px]">
                    <thead>
                      <tr className="text-[#EDB546] text-xs sm:text-sm md:text-base font-semibold sticky top-0 bg-[#181A20] z-10">
                        {activeTab === "Open Order" ? (
                          <>
                            <th className="py-1 sm:py-2 px-1 sm:px-2 font-semibold w-1/8 text-center">Order Id</th>
                            <th className="py-1 sm:py-2 px-1 sm:px-2 font-semibold w-1/8 text-center">Name</th>
                            <th className="py-1 sm:py-2 px-1 sm:px-2 font-semibold w-1/8 text-center">Order Type</th>
                            <th className="py-1 sm:py-2 px-1 sm:px-2 font-semibold w-1/8 text-center">Amount</th>
                            <th className="py-1 sm:py-2 px-1 sm:px-2 font-semibold w-1/8 text-center">Leverage</th>
                            <th className="py-1 sm:py-2 px-1 sm:px-2 font-semibold w-1/8 text-center">Status</th>
                            <th className="py-1 sm:py-2 px-1 sm:px-2 font-semibold w-1/8 text-center">
                              Transaction Hash
                            </th>
                            <th className="py-1 sm:py-2 px-1 sm:px-2 font-semibold w-1/8 text-center">Created At</th>
                          </>
                        ) : activeTab === "Order History" ? (
                          <>
                            <th className="py-1 sm:py-2 px-1 sm:px-2 font-semibold w-1/8 text-center">Order Id</th>
                            <th className="py-1 sm:py-2 px-1 sm:px-2 font-semibold w-1/8 text-center">Name</th>
                            <th className="py-1 sm:py-2 px-1 sm:px-2 font-semibold w-1/8 text-center">Order Type</th>
                            <th className="py-1 sm:py-2 px-1 sm:px-2 font-semibold w-1/8 text-center">Amount</th>
                            <th className="py-1 sm:py-2 px-1 sm:px-2 font-semibold w-1/8 text-center">Leverage</th>
                            <th className="py-1 sm:py-2 px-1 sm:px-2 font-semibold w-1/8 text-center">Status</th>
                            <th className="py-1 sm:py-2 px-1 sm:px-2 font-semibold w-1/8 text-center">
                              Transaction Hash
                            </th>
                            <th className="py-1 sm:py-2 px-1 sm:px-2 font-semibold w-1/8 text-center">Created At</th>
                          </>
                        ) : activeTab === "Trade History" ? (
                          <>
                            <th className="py-1 sm:py-2 px-1 sm:px-2 font-semibold w-1/8 text-center">Order Id</th>
                            <th className="py-1 sm:py-2 px-1 sm:px-2 font-semibold w-1/8 text-center">Name</th>
                            <th className="py-1 sm:py-2 px-1 sm:px-2 font-semibold w-1/8 text-center">Amount</th>
                            <th className="py-1 sm:py-2 px-1 sm:px-2 font-semibold w-1/8 text-center">
                              Claimable Amount
                            </th>
                            <th className="py-1 sm:py-2 px-1 sm:px-2 font-semibold w-1/8 text-center">PnL</th>
                            <th className="py-1 sm:py-2 px-1 sm:px-2 font-semibold w-1/8 text-center">Status</th>
                            <th className="py-1 sm:py-2 px-1 sm:px-2 font-semibold w-1/8 text-center">
                              Transaction Hash
                            </th>
                            <th className="py-1 sm:py-2 px-1 sm:px-2 font-semibold w-1/8 text-center">Created At</th>
                          </>
                        ) : activeTab === "Pool" ? (
                          <>
                            <th className="py-1 sm:py-2 px-1 sm:px-2 font-semibold w-1/6 text-center">Name</th>
                            <th className="py-1 sm:py-2 px-1 sm:px-2 font-semibold w-1/6 text-center">Pool Type</th>
                            <th className="py-1 sm:py-2 px-1 sm:px-2 font-semibold w-1/6 text-center">Status</th>
                            <th className="py-1 sm:py-2 px-1 sm:px-2 font-semibold w-1/6 text-center">Order Count</th>
                            <th className="py-1 sm:py-2 px-1 sm:px-2 font-semibold w-1/6 text-center">Start Time</th>
                            <th className="py-1 sm:py-2 px-1 sm:px-2 font-semibold w-1/6 text-center">Timer</th>
                          </>
                        ) : activeTab === "Funds" ? (
                          <>
                            <th className="py-1 sm:py-2 px-1 sm:px-2 font-semibold w-1/2 text-center">Name</th>
                            <th className="py-1 sm:py-2 px-1 sm:px-2 font-semibold w-1/2 text-center">Amount</th>
                          </>
                        ) : (
                          <>
                            <th className="py-1 sm:py-2 px-1 sm:px-2 font-semibold w-1/5 text-center">Name</th>
                            <th className="py-1 sm:py-2 px-1 sm:px-2 font-semibold w-1/5 text-center">Amount</th>
                            <th className="py-1 sm:py-2 px-1 sm:px-2 font-semibold w-1/5 text-center">Leverage</th>
                            <th className="py-1 sm:py-2 px-1 sm:px-2 font-semibold w-1/5 text-center">Order Type</th>
                            <th className="py-1 sm:py-2 px-1 sm:px-2 font-semibold w-1/5 text-center">Created At</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {getActiveData().map((item: any, index: number) => (
                        <tr
                          key={item?._id || index}
                          className="border-b border-[#2b2d32] last:border-0 cursor-pointer hover:bg-[#1F2128] transition-colors"
                        >
                          {activeTab === "Open Order" ? (
                            <>
                              <td
                                onClick={() => handleCopy(item?._id)}
                                className={`py-1 sm:py-2 px-1 sm:px-2 ${index % 2 === 0 ? "text-[#EDB546]" : "text-[#d4b26f]"} text-xs sm:text-sm font-medium truncate text-center`}
                              >
                                {item?._id}
                              </td>
                              <td
                                className={`py-1 sm:py-2 px-1 sm:px-2 ${index % 2 === 0 ? "text-[#EDB546]" : "text-[#d4b26f]"} text-xs sm:text-sm font-medium text-center`}
                              >
                                {item?.symbol}
                              </td>
                              <td
                                className={`py-1 sm:py-2 px-1 sm:px-2 ${index % 2 === 0 ? "text-[#EDB546]" : "text-[#d4b26f]"} text-xs sm:text-sm font-medium text-center`}
                              >
                                {item?.order_type}
                              </td>
                              <td
                                className={`py-1 sm:py-2 px-1 sm:px-2 ${index % 2 === 0 ? "text-[#EDB546]" : "text-[#d4b26f]"} text-xs sm:text-sm font-medium text-center`}
                              >
                                {item?.amount}
                              </td>
                              <td
                                className={`py-1 sm:py-2 px-1 sm:px-2 ${index % 2 === 0 ? "text-[#EDB546]" : "text-[#d4b26f]"} text-xs sm:text-sm font-medium text-center`}
                              >
                                {item?.leverage}
                              </td>
                              <td
                                className={`py-1 sm:py-2 px-1 sm:px-2 ${index % 2 === 0 ? "text-[#EDB546]" : "text-[#d4b26f]"} text-xs sm:text-sm font-medium text-center`}
                              >
                                {item?.status}
                              </td>
                              <td
                                className={`py-1 sm:py-2 px-1 sm:px-2 ${index % 2 === 0 ? "text-[#EDB546]" : "text-[#d4b26f]"} text-xs sm:text-sm font-medium cursor-pointer hover:underline text-center`}
                                onClick={() => {
                                  item?.transactionHash
                                    ? window.open(
                                        `https://testnet.bscscan.com/tx/${item?.transactionHash}`,
                                        "_blank",
                                        "noopener,noreferrer",
                                      )
                                    : ""
                                }}
                              >
                                {item?.transactionHash
                                  ? `${item?.transactionHash.slice(0, 8)}...${item?.transactionHash.slice(-7)}`
                                  : "Claim"}
                              </td>
                              <td
                                className={`py-1 sm:py-2 px-1 sm:px-2 ${index % 2 === 0 ? "text-[#EDB546]" : "text-[#d4b26f]"} text-xs sm:text-sm font-medium text-center`}
                              >
                                {new Date(item?.createdAt).toLocaleString()}
                              </td>
                            </>
                          ) : activeTab === "Order History" ? (
                            <>
                              <td
                                onClick={() => handleCopy(item?._id)}
                                className={`py-1 sm:py-2 px-1 sm:px-2 ${index % 2 === 0 ? "text-[#EDB546]" : "text-[#d4b26f]"} text-xs sm:text-sm font-medium truncate cursor-pointer text-center`}
                              >
                                {item?._id}
                              </td>
                              <td
                                className={`py-1 sm:py-2 px-1 sm:px-2 ${index % 2 === 0 ? "text-[#EDB546]" : "text-[#d4b26f]"} text-xs sm:text-sm font-medium text-center`}
                              >
                                {item?.symbol}
                              </td>
                              <td
                                className={`py-1 sm:py-2 px-1 sm:px-2 ${index % 2 === 0 ? "text-[#EDB546]" : "text-[#d4b26f]"} text-xs sm:text-sm font-medium text-center`}
                              >
                                {item?.order_type}
                              </td>
                              <td
                                className={`py-1 sm:py-2 px-1 sm:px-2 ${index % 2 === 0 ? "text-[#EDB546]" : "text-[#d4b26f]"} text-xs sm:text-sm font-medium text-center`}
                              >
                                {item?.amount}
                              </td>
                              <td
                                className={`py-1 sm:py-2 px-1 sm:px-2 ${index % 2 === 0 ? "text-[#EDB546]" : "text-[#d4b26f]"} text-xs sm:text-sm font-medium text-center`}
                              >
                                {item?.leverage}
                              </td>
                              <td
                                className={`py-1 sm:py-2 px-1 sm:px-2 ${index % 2 === 0 ? "text-[#EDB546]" : "text-[#d4b26f]"} text-xs sm:text-sm font-medium text-center`}
                              >
                                {item?.status}
                              </td>
                              <td
                                className={`py-1 sm:py-2 px-1 sm:px-2 ${index % 2 === 0 ? "text-[#EDB546]" : "text-[#d4b26f]"} text-xs sm:text-sm font-medium cursor-pointer hover:underline text-center`}
                                onClick={() => {
                                  item?.transactionHash
                                    ? window.open(
                                        `https://testnet.bscscan.com/tx/${item?.transactionHash}`,
                                        "_blank",
                                        "noopener,noreferrer",
                                      )
                                    : ""
                                }}
                              >
                                {item?.transactionHash
                                  ? `${item?.transactionHash.slice(0, 8)}...${item?.transactionHash.slice(-7)}`
                                  : "Claim"}
                              </td>
                              <td
                                className={`py-1 sm:py-2 px-1 sm:px-2 ${index % 2 === 0 ? "text-[#EDB546]" : "text-[#d4b26f]"} text-xs sm:text-sm font-medium text-center`}
                              >
                                {new Date(item?.createdAt).toLocaleString()}
                              </td>
                            </>
                          ) : activeTab === "Trade History" ? (
                            <>
                              <td
                                className={`py-1 sm:py-2 px-1 sm:px-2 ${index % 2 === 0 ? "text-[#EDB546]" : "text-[#d4b26f]"} text-xs sm:text-sm font-medium text-center`}
                              >
                                {item?.order_id}
                              </td>
                              <td
                                className={`py-1 sm:py-2 px-1 sm:px-2 ${index % 2 === 0 ? "text-[#EDB546]" : "text-[#d4b26f]"} text-xs sm:text-sm font-medium text-center`}
                              >
                                {item?.symbol}
                              </td>
                              <td
                                className={`py-1 sm:py-2 px-1 sm:px-2 ${index % 2 === 0 ? "text-[#EDB546]" : "text-[#d4b26f]"} text-xs sm:text-sm font-medium text-center`}
                              >
                                {item?.amount}
                              </td>
                              <td
                                className={`py-1 sm:py-2 px-1 sm:px-2 ${index % 2 === 0 ? "text-[#EDB546]" : "text-[#d4b26f]"} text-xs sm:text-sm font-medium text-center`}
                              >
                                {item?.calimable_amount}
                              </td>
                              <td
                                className={`py-1 sm:py-2 px-1 sm:px-2 ${index % 2 === 0 ? "text-[#EDB546]" : "text-[#d4b26f]"} text-xs sm:text-sm font-medium text-center`}
                              >
                                {item?.profit_loss}
                              </td>
                              <td
                                className={`py-1 sm:py-2 px-1 sm:px-2 ${index % 2 === 0 ? "text-[#EDB546]" : "text-[#d4b26f]"} text-xs sm:text-sm font-medium text-center`}
                              >
                                {item?.status}
                              </td>
                              <td
                                className={`py-1 sm:py-2 px-1 sm:px-2 ${index % 2 === 0 ? "text-[#EDB546]" : "text-[#d4b26f]"} text-xs sm:text-sm font-medium cursor-pointer hover:underline text-center`}
                                onClick={() => {
                                  item?.transactionHash
                                    ? window.open(
                                        `https://testnet.bscscan.com/tx/${item?.transactionHash}`,
                                        "_blank",
                                        "noopener,noreferrer",
                                      )
                                    : ""
                                }}
                              >
                                {item?.transactionHash
                                  ? `${item?.transactionHash.slice(0, 8)}...${item?.transactionHash.slice(-7)}`
                                  : "Claim"}
                              </td>
                              <td
                                className={`py-1 sm:py-2 px-1 sm:px-2 ${index % 2 === 0 ? "text-[#EDB546]" : "text-[#d4b26f]"} text-xs sm:text-sm font-medium text-center`}
                              >
                                {new Date(item?.createdAt).toLocaleString()}
                              </td>
                            </>
                          ) : activeTab === "Pool" ? (
                            <>
                              <td
                                className={`py-1 sm:py-2 px-1 sm:px-2 ${index % 2 === 0 ? "text-[#EDB546]" : "text-[#d4b26f]"} text-xs sm:text-sm font-medium text-center`}
                              >
                                {item?.symbol}
                              </td>
                              <td
                                className={`py-1 sm:py-2 px-1 sm:px-2 ${index % 2 === 0 ? "text-[#EDB546]" : "text-[#d4b26f]"} text-xs sm:text-sm font-medium text-center`}
                              >
                                {item?.pool_type}
                              </td>
                              <td
                                className={`py-1 sm:py-2 px-1 sm:px-2 ${index % 2 === 0 ? "text-[#EDB546]" : "text-[#d4b26f]"} text-xs sm:text-sm font-medium text-center`}
                              >
                                {item?.status}
                              </td>
                              <td
                                className={`py-1 sm:py-2 px-1 sm:px-2 ${index % 2 === 0 ? "text-[#EDB546]" : "text-[#d4b26f]"} text-xs sm:text-sm font-medium text-center`}
                              >
                                {item?.ordersCount}
                              </td>
                              <td
                                className={`py-1 sm:py-2 px-1 sm:px-2 ${index % 2 === 0 ? "text-[#EDB546]" : "text-[#d4b26f]"} text-xs sm:text-sm font-medium text-center`}
                              >
                                {new Date(item?.start_timestamps).toLocaleString()}
                              </td>
                              <td
                                className={`py-1 sm:py-2 px-1 sm:px-2 ${index % 2 === 0 ? "text-[#EDB546]" : "text-[#d4b26f]"} text-xs sm:text-sm font-medium text-center`}
                              >
                                <CountdownTimer
                                  startTimestamp={
                                    item?.status === "OPEN" ? item?.start_timestamps : item?.process_timestamps
                                  }
                                />
                              </td>
                            </>
                          ) : activeTab === "Funds" ? (
                            <>
                              <td
                                className={`py-1 sm:py-2 px-1 sm:px-2 ${index % 2 === 0 ? "text-[#EDB546]" : "text-[#d4b26f]"} text-xs sm:text-sm font-medium text-center`}
                              >
                                {item?.symbol}
                              </td>
                              <td
                                className={`py-1 sm:py-2 px-1 sm:px-2 ${index % 2 === 0 ? "text-[#EDB546]" : "text-[#d4b26f]"} text-xs sm:text-sm font-medium text-center`}
                              >
                                {item?.amount}
                              </td>
                            </>
                          ) : (
                            <>
                              <td
                                className={`py-1 sm:py-2 px-1 sm:px-2 ${index % 2 === 0 ? "text-[#EDB546]" : "text-[#d4b26f]"} text-xs sm:text-sm font-medium text-center`}
                              >
                                {item?.symbol}
                              </td>
                              <td
                                className={`py-1 sm:py-2 px-1 sm:px-2 ${index % 2 === 0 ? "text-[#EDB546]" : "text-[#d4b26f]"} text-xs sm:text-sm font-medium text-center`}
                              >
                                {item?.amount}
                              </td>
                              <td
                                className={`py-1 sm:py-2 px-1 sm:px-2 ${index % 2 === 0 ? "text-[#EDB546]" : "text-[#d4b26f]"} text-xs sm:text-sm font-medium text-center`}
                              >
                                {item?.leverage}
                              </td>
                              <td
                                className={`py-1 sm:py-2 px-1 sm:px-2 ${index % 2 === 0 ? "text-[#EDB546]" : "text-[#d4b26f]"} text-xs sm:text-sm font-medium text-center`}
                              >
                                {item?.order_type}
                              </td>
                              <td
                                className={`py-1 sm:py-2 px-1 sm:px-2 ${index % 2 === 0 ? "text-[#EDB546]" : "text-[#d4b26f]"} text-xs sm:text-sm font-medium text-center`}
                              >
                                {new Date(item?.createdAt).toLocaleString()}
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden">
                {getActiveData().map((item: any, index: number) => renderMobileCard(item, index))}
              </div>
            </>
          ) : (
            <div className="text-center text-[#848E9C] py-4 sm:py-8 text-sm sm:text-base">
              No data found for this category.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default OrdersPanel

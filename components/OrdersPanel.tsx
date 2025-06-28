"use client";
import { useAccount } from "@/config/context/AccountContext";
import { useAppKit } from "@reown/appkit/react";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "@/store/slices/orderSlice";
import { AppDispatch, RootState } from "@/store/store";
import { fetchPool, fetchResultsByUser } from "@/store/slices/poolSlice";
import CountdownTimer from "./countdownTimer";
import { currentBalance } from "@/config/Web3Controller";
import { balanceInnterface, setUserBalance } from "@/store/slices/binanceSlice";

interface Order {
  _id: string;
  symbol: string;
  amount: number;
  leverage: number;
  order_type: string;
  status: "LOSER" | "WINNER" | "DRAW" | "PROCESSING" | "INPROGRESS" | "Order History" | "Trade History" | "PENDING" | "COMPLETE" | "OPEN";
  createdAt: string;
  transactionHash?: string;
}

const tabs = ["Open Order", "Order History", "Trade History", "Pool", "Funds"];

const OrdersPanel: React.FC = () => {
  const { userBalance } = useSelector((state: any) => state.binance);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { orders } = useSelector((state: RootState) => state.order);
  const { pool, orderRresults } = useSelector((state: RootState) => state.pool);
  const { isConnected, address } = useAccount();
  const { open } = useAppKit();
  const [data, setData] = useState<Order[]>([]);
  const [poolData, setPoolData] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState("Open Order");
  const dispatch = useDispatch<AppDispatch>();
  const [copied, setCopied] = useState(false);

  const [fundsData, setFundsData] = useState([{ 'symbol': 'USDT', "amount": '0' }, { 'symbol': 'BNB', "amount": '0' }])

  useEffect(() => {
    if (userBalance) {
      setFundsData([{ 'symbol': 'USDT', "amount": userBalance.usdt }, { 'symbol': 'BNB', "amount": userBalance.bnb }])
    }
  }, [userBalance])


  useEffect(() => {
    if (!(isConnected)) return;

    const fetch = () => {
      dispatch(fetchOrders());
      dispatch(fetchResultsByUser());
    };
    fetch()
    const now = new Date();
    const msPastHour =
      now.getMinutes() * 60 * 1000 +
      now.getSeconds() * 1000 +
      now.getMilliseconds();

    // const msUntilNext5Min = (5 - (now.getMinutes() % 5)) * 60 * 1000 - (ms % (5 * 60 * 1000));
    const msUntilNext5Min = (5 * 60 * 1000) - (msPastHour % (5 * 60 * 1000));
    // Calculate the exact next run time
    const nextRun = new Date(Date.now() + msUntilNext5Min);
    console.log("Next fetch scheduled at:", nextRun.toLocaleTimeString());

    const timeoutId = setTimeout(() => {
      fetch(); // First call exactly at next 5-minute mark

      intervalRef.current = setInterval(fetch, 5 * 60 * 1000); // Then every 5 min
    }, msUntilNext5Min);


    // Cleanup both timeout and interval
    return () => {
      clearTimeout(timeoutId);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };

  }, [isConnected, dispatch]);




  useEffect(() => {
    const token = localStorage.getItem('token');

    // Exit early if not connected or no token
    if (!isConnected || !token) return;

    // Run immediately
    dispatch(fetchPool());
    // Start polling every 10 seconds
    const interval = setInterval(() => {
      dispatch(fetchPool());
    }, 10000);

    // Cleanup: stop polling when disconnected or on component unmount
    return () => clearInterval(interval);
  }, [isConnected, dispatch]);

  useEffect(() => {
    if (orders) setData(orders);
  }, [orders]);

  useEffect(() => {
    if (pool) setPoolData(pool);
  }, [pool]);

  const getActiveData = () => {
    if (!data) return [];

    switch (activeTab) {
      case "Open Order":
        return data.filter((order) => (order.status === "PENDING" || order.status === "PROCESSING"));
      case "Order History":
        return data.filter((order) => (order.status === "LOSER" || order.status === "WINNER" || order.status === "DRAW"));
      case "Trade History":
        return orderRresults;
      case "Pool":
        return poolData
      case "Funds":
        return fundsData;
      default:
        return data;
    }
  };


  const getTabCount = (tab: string) => {
    switch (tab) {
      case "Open Order":
        return data.filter((order) => (order.status.toLocaleLowerCase() === "PENDING".toLocaleLowerCase() || order.status.toLocaleLowerCase() === "PROCESSING".toLocaleLowerCase())).length;
      case "Order History":
        return data.filter((order) => (order.status.toLocaleLowerCase() === "LOSER".toLocaleLowerCase() || order.status.toLocaleLowerCase() === "WINNER".toLocaleLowerCase() || order.status.toLocaleLowerCase() === "DRAW".toLocaleLowerCase())).length;
      case "Trade History":
        return orderRresults.length;
      case "Pool":
        return poolData.length;
      case "Funds":
        return fundsData.length;
      default:
        return 0;
    }
  };

  useEffect(() => {
    if (!isConnected) {
      setActiveTab("");
      setData([]);
      setPoolData([]);
    }
  }, [isConnected]);

  const testStartTimestamp = React.useMemo(() => {
    return new Date(Date.now() - 2 * 60 * 1000).toISOString();
  }, []); // Runs only once

  const handleCopy = async (hash: string) => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500); // Reset after 1.5s
    } catch (err) {
      console.error('Failed to copy hash:', err);
    }
  };

  return (
    <div className="bg-[#181A20] text-white p-4 sm:p-6 rounded-3xl border border-gray-800 min-h-[300px] sm:min-h-[250px] w-full">
      <div className="flex flex-wrap gap-4 sm:gap-8 border-b border-[#2B3139] rounded-t-2xl pb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              if (!isConnected) return;
              setActiveTab((prev) => (prev === tab ? "" : tab));
            }}
            disabled={!isConnected}
            className={`relative bg-none border-none text-sm sm:text-base pb-2
              ${activeTab === tab
                ? "text-[#EDB546] font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-[#f0b90b]"
                : "text-[#848E9C]"} 
              cursor-pointer disabled:cursor-not-allowed`}
          >
            {`${tab} (${getTabCount(tab)})`}
          </button>
        ))}
      </div>

      {!isConnected ? (
        <div className="flex item?s-center justify-center h-full p-8 sm:p-20 text-center text-[#EDB546]">
          <p className="text-xs sm:text-sm">
            <span className="underline cursor-pointer" onClick={() => open()}>
              Log in
            </span>
            <span className="text-[#848E9C]"> or </span>
            <span className="underline cursor-pointer">Register Now</span>
            <span className="text-[#848E9C]"> to trade</span>
          </p>
        </div>
      ) : (
        <div className="max-h-[400px] overflow-y-auto">

          <table className="w-full table-fixed">
            <thead>

              <tr className="text-[#EDB546] text-sm sticky top-0 bg-[#181A20] z-10">
                {
                  activeTab === "Open Order" ? (
                    <>
                      <th className="py-4 px-4 font-semibold w-1/5">Order Id</th>
                      <th className="py-4 px-4 font-semibold w-1/5">Name</th>
                      <th className="py-4 px-4 font-semibold w-1/5">Amount</th>
                      <th className="py-4 px-4 font-semibold w-1/5">Leverage</th>
                      <th className="py-4 px-4 font-semibold w-1/5">Order Type</th>
                      <th className="py-4 px-4 font-semibold w-1/5">Status</th>
                      <th className="py-4 px-4 font-semibold w-1/5">Transaction Hash</th>
                      <th className="py-4 px-4 font-semibold w-1/5">Created At</th>
                    </>
                  ) :
                    activeTab === "Order History" ? (
                      <>
                        <th className="py-4 px-4 font-semibold w-1/5">Order Id</th>
                        <th className="py-4 px-4 font-semibold w-1/5">Name</th>
                        <th className="py-4 px-4 font-semibold w-1/5">Amount</th>
                        <th className="py-4 px-4 font-semibold w-1/5">Leverage</th>
                        <th className="py-4 px-4 font-semibold w-1/5">Order Type</th>
                        <th className="py-4 px-4 font-semibold w-1/5">Status</th>
                        <th className="py-4 px-4 font-semibold w-1/5">Transaction Hash</th>
                        <th className="py-4 px-4 font-semibold w-1/5">Created At</th>
                      </>
                    ) :

                      activeTab === "Trade History" ? (
                        <>
                          <th className="py-4 px-4 font-semibold w-1/5">Order Id</th>
                          <th className="py-4 px-4 font-semibold w-1/5">Name</th>
                          <th className="py-4 px-4 font-semibold w-1/5">Amount</th>
                          <th className="py-4 px-4 font-semibold w-1/5">Claimable Amount</th>
                          <th className="py-4 px-4 font-semibold w-1/5">Status</th>
                          <th className="py-4 px-4 font-semibold w-1/5">Action</th>
                        </>
                      ) :

                        activeTab === "Pool" ? (
                          <>
                            <th className="py-4 px-4 font-semibold w-1/4">Name</th>
                            <th className="py-4 px-4 font-semibold w-1/4">Pool Type</th>
                            <th className="py-4 px-4 font-semibold w-1/4">Status</th>
                            <th className="py-4 px-4 font-semibold w-1/4">Order Count</th>
                            <th className="py-4 px-4 font-semibold w-1/4">Start Time</th>
                            <th className="py-4 px-4 font-semibold w-1/4">Timer</th>
                          </>
                        ) : activeTab === "Funds" ? (
                          <>
                            <th className="py-4 px-4 font-semibold w-1/5">Name</th>
                            <th className="py-4 px-4 font-semibold w-1/5">Amount</th>
                          </>
                        ) :
                          (
                            <>
                              <th className="py-4 px-4 font-semibold w-1/5">Name</th>
                              <th className="py-4 px-4 font-semibold w-1/5">Amount</th>
                              <th className="py-4 px-4 font-semibold w-1/5">Leverage</th>
                              <th className="py-4 px-4 font-semibold w-1/5">Order Type</th>
                              <th className="py-4 px-4 font-semibold w-1/5">Created At</th>
                            </>
                          )
                }
              </tr>
            </thead>

            <tbody>
              {getActiveData().length > 0 ? (
                getActiveData().map((item: any) => (
                  <tr
                    key={item?._id}
                    className="border-b border-[#2b2d32] last:border-0 cursor-pointer"
                  >
                    {
                      activeTab === "Open Order" ? (
                        <>
                          <td onClick={() => handleCopy(item?._id)} className="py-4 px-4 text-[#EDB546] font-medium cursor-pointer">{`${item?._id.slice(0, 8)}...`}</td>
                          <td className="py-4 px-4 text-[#EDB546] font-medium">{item?.symbol}</td>
                          <td className="py-4 px-4 text-[#EDB546] font-medium">{item?.amount}</td>
                          <td className="py-4 px-4 text-[#EDB546] font-medium">{item?.leverage}</td>
                          <td className="py-4 px-4 text-[#EDB546] font-medium">{item?.order_type}</td>
                          <td className="py-4 px-4 text-[#EDB546] font-medium">{item?.status}</td>
                          <td onClick={() => handleCopy(item?.transactionHash)} className="py-4 px-4 text-[#EDB546] font-medium cursor-pointer">{`${item?.transactionHash.slice(0, 6)}...${item?.transactionHash.slice(-4)}`}</td>
                          <td className="py-4 px-4 text-[#EDB546] font-medium">
                            {new Date(item?.createdAt).toLocaleString()}
                          </td>
                        </>
                      ) :

                        activeTab === "Order History" ? (
                          <>
                            <td onClick={() => handleCopy(item?._id)} className="py-4 px-4 text-[#EDB546] font-medium cursor-pointer">{`${item?._id.slice(0, 8)}...`}</td>
                            <td className="py-4 px-4 text-[#EDB546] font-medium">{item?.symbol}</td>
                            <td className="py-4 px-4 text-[#EDB546] font-medium">{item?.amount}</td>
                            <td className="py-4 px-4 text-[#EDB546] font-medium">{item?.leverage}</td>
                            <td className="py-4 px-4 text-[#EDB546] font-medium">{item?.order_type}</td>
                            <td className="py-4 px-4 text-[#EDB546] font-medium">{item?.status}</td>
                            <td onClick={() => handleCopy(item?.transactionHash)} className="py-4 px-4 text-[#EDB546] font-medium cursor-pointer">{`${item?.transactionHash.slice(0, 6)}...${item?.transactionHash.slice(-4)}`}</td>
                            <td className="py-4 px-4 text-[#EDB546] font-medium">
                              {new Date(item?.createdAt).toLocaleString()}
                            </td>
                          </>
                        ) :
                          activeTab === "Trade History" ? (
                            <>
                              <td className="py-4 px-4 text-[#EDB546] font-medium">{item?.order_id}</td>
                              <td className="py-4 px-4 text-[#EDB546] font-medium">{item?.symbol}</td>
                              <td className="py-4 px-4 text-[#EDB546] font-medium">{item?.amount}</td>
                              <td className="py-4 px-4 text-[#EDB546] font-medium">{item?.calimable_amount}</td>
                              <td className="py-4 px-4 text-[#EDB546] font-medium">{item?.status}</td>
                              <td className="py-4 px-4">
                                <button
                                  // onClick={() => handleAction(item)}
                                  className="bg-[#edb546] hover:bg-[#edb546]/90 text-black font-medium px-6 py-2 rounded-full text-sm border-2 border-[#edb546]"
                                >
                                  {(item?.isClaimed && !item?.isExpired) ? 'Clameable' : "Already Clamed"}
                                </button>
                              </td>
                            </>
                          ) :

                            activeTab === "Pool" ? (
                              <>
                                <td className="py-4 px-4 text-[#EDB546] font-medium">{item?.symbol}</td>
                                <td className="py-4 px-4 text-[#EDB546] font-medium">{item?.pool_type}</td>
                                <td className="py-4 px-4 text-[#EDB546] font-medium">{item?.status}</td>
                                <td className="py-4 px-4 text-[#EDB546] font-medium">{item?.ordersCount}</td>
                                <td className="py-4 px-4 text-[#EDB546] font-medium">
                                  {new Date(item?.start_timestamps).toLocaleString()}
                                </td>
                                <td className="py-4 px-4 text-[#EDB546] font-medium">
                                  <CountdownTimer startTimestamp={item?.status === 'OPEN' ? item?.start_timestamps : item?.process_timestamps} />
                                </td>
                              </>
                            ) :

                              activeTab === "Funds" ? (
                                <>
                                  <td className="py-4 px-4 text-[#EDB546] font-medium">{item?.symbol}</td>
                                  <td className="py-4 px-4 text-[#EDB546] font-medium">{item?.amount}</td>
                                </>
                              ) :

                                (
                                  <>
                                    <td className="py-4 px-4 text-[#EDB546] font-medium">{item?.symbol}</td>
                                    <td className="py-4 px-4 text-[#EDB546] font-medium">{item?.amount}</td>
                                    <td className="py-4 px-4 text-[#EDB546] font-medium">{item?.leverage}</td>
                                    <td className="py-4 px-4 text-[#EDB546] font-medium">{item?.order_type}</td>
                                    <td className="py-4 px-4 text-[#EDB546] font-medium">
                                      {new Date(item?.createdAt).toLocaleString()}
                                    </td>
                                  </>
                                )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={activeTab === "Pool" ? 6 : 5} className="text-center text-[#848E9C] py-8">
                    No data found for this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

        </div>
      )}
    </div>
  );
};

export default OrdersPanel;

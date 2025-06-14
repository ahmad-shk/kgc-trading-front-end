"use client";
import { useAccount } from "@/config/context/AccountContext";
import { useAppKit } from "@reown/appkit/react";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "@/store/slices/orderSlice";
import { AppDispatch, RootState } from "@/store/store";
import { fetchPool } from "@/store/slices/poolSlice";

interface Order {
  _id: string;
  symbol: string;
  amount: number;
  leverage: number;
  order_type: string;
  status: "INPROGRESS" | "Order History" | "Trade History" | "PENDING" | "COMPLETE" | "OPEN";
  createdAt: string;
  transactionHash?: string;
}

const tabs = ["Open Order", "Order History", "Trade History", "Pool", "Funds"];

const OrdersPanel: React.FC = () => {
  const { orders } = useSelector((state: RootState) => state.order);
  const { pool } = useSelector((state: RootState) => state.pool);
  const { isConnected } = useAccount();
  const { open } = useAppKit();
  const [data, setData] = useState<Order[]>([]);
  const [poolData, setPoolData] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState("Open Order");
  const dispatch = useDispatch<AppDispatch>();
  const [fundsData, setFundsData] = useState([{'symbol': 'USDT', "amount": '10' }, {'symbol': 'BNB', "amount": '20' }])

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage?.getItem("token") : null;
    if (token && isConnected) {
      dispatch(fetchOrders());
      dispatch(fetchPool());
    } else {
      const interval = setInterval(() => {
        const token = typeof window !== 'undefined' ? localStorage?.getItem("token") : null;
        if (token && isConnected) {
          dispatch(fetchOrders());
          dispatch(fetchPool());
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isConnected, dispatch]);

  useEffect(() => {
    if (orders) setData(orders);
    if (pool) setPoolData(pool);
  }, [orders, pool]);

  const getActiveData = () => {
    if (!data) return [];
    switch (activeTab) {
      case "Open Order":
        return data.filter((order) => order.status === "INPROGRESS");
      case "Order History":
        return data.filter((order) => order.status === "PENDING");
      case "Trade History":
        return data.filter((order) => order.status === "COMPLETE");
      case "Pool":
        return poolData.filter((order) => order.status === "OPEN");
      case "Funds":
        return fundsData;
      default:
        return data;
    }
  };
  
// console.log(poolData,'pool')
  const getTabCount = (tab: string) => {
    switch (tab) {
      case "Open Order":
        return data.filter((order) => order.status.toLocaleLowerCase() === "INPROGRESS".toLocaleLowerCase()).length;
      case "Order History":
        return data.filter((order) => order.status.toLocaleLowerCase() === "PENDING".toLocaleLowerCase()).length;
      case "Trade History":
        return data.filter((order) => order.status.toLocaleLowerCase() === "COMPLETE".toLocaleLowerCase()).length;
      case "Pool":
        return poolData.filter((order) => order.status.toLocaleLowerCase() === "OPEN".toLocaleLowerCase()).length;
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
                {activeTab === "Pool" ? (
                  <>
                    <th className="py-4 px-4 font-semibold w-1/4">Name</th>
                    <th className="py-4 px-4 font-semibold w-1/4">Pool Type</th>
                    <th className="py-4 px-4 font-semibold w-1/4">Start Time</th>
                    <th className="py-4 px-4 font-semibold w-1/4">End Time</th>
                  </>
                ) : activeTab === "Funds" ?  (
                  <>
                    <th className="py-4 px-4 font-semibold w-1/5">Name</th>
                    <th className="py-4 px-4 font-semibold w-1/5">Amount</th>
                  </>
                ):
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
                getActiveData().map((item) => (
                  <tr
                    key={item?._id}
                    className="border-b border-[#2b2d32] last:border-0 cursor-pointer"
                  >
                    {activeTab === "Pool" ? (
                      <>
                        <td className="py-4 px-4 text-[#EDB546] font-medium">{item?.symbol}</td>
                        <td className="py-4 px-4 text-[#EDB546] font-medium">{item?.pool_type}</td>
                        <td className="py-4 px-4 text-[#EDB546] font-medium">
                          {new Date(item?.start_timestamps).toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-[#EDB546] font-medium">
                          {new Date(item?.end_timestamps).toLocaleString()}
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
                  <td colSpan={activeTab === "Pool" ? 4 : 5} className="text-center text-[#848E9C] py-8">
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

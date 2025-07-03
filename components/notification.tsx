"use client";

import React, { useEffect, useState, useRef } from "react";
import { Bell, TrendingUp, TrendingDown } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface Order {
  _id: string;
  symbol: string;
  amount: number;
  leverage: number;
  order_type: string;
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
    | "OPEN";
  createdAt: string;
  transactionHash?: string;
}

interface Notification {
  id: number;
  type: "win" | "loss";
  title: string;
  unread: boolean;
  createdAt: string;
}

const now = new Date();
const notifications: Notification[] = [
  {
    id: 1,
    type: "win",
    title: "EUR/USD +$245",
    unread: true,
    createdAt: new Date(now.getTime() - 2 * 60 * 1000).toISOString(), // 2 mins ago
  },
  {
    id: 2,
    type: "loss",
    title: "GBP/JPY -$89",
    unread: true,
    createdAt: new Date(now.getTime() - 15 * 60 * 1000).toISOString(), // 15 mins ago
  },
  {
    id: 3,
    type: "win",
    title: "BTC/USD +$1.2k",
    unread: false,
    createdAt: new Date(now.getTime() - 60 * 60 * 1000).toISOString(), // 1 hour ago
  },
  {
    id: 4,
    type: "loss",
    title: "ETH/USD -$340",
    unread: false,
    createdAt: new Date(now.getTime() - 3 * 60 * 1000).toISOString(), // 3 mins ago
  },
];

const notificationStyles = {
  win: {
    icon: <TrendingUp className="w-4 h-4 text-[#181A20]" />,
    bg: "#EDB546",
    label: "Win",
  },
  loss: {
    icon: <TrendingDown className="w-4 h-4 text-[#181A20]" />,
    bg: "#F87171",
    label: "Loss",
  },
};

function getTimeAgo(createdAt: string): string {
  const minutes = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
  return `${minutes} mins ago`;
}

export default function NotificationComponent() {
  const { orderRresults } = useSelector((state: RootState) => state.pool);
  const [data, setData] = useState<Order[]>([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
  const recentNotifications = notifications.filter(
    (n) => new Date(n.createdAt).getTime() >= fiveMinutesAgo
  );
  const unreadCount = recentNotifications.length;

  useEffect(() => {
    if (orderRresults?.length > 0) {
      setData(orderRresults);
    }
  }, [orderRresults]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center justify-center">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full bg-[#edb546] hover:bg-[#edb546]/90"
      >
        <Bell className="w-5 h-5 text-black" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={dropdownRef}
          className="absolute top-12 right-0 w-80 bg-[#181A20] shadow-md rounded-xl z-10"
        >
          <div className="border-b px-3 py-1 text-sm font-semibold flex justify-between items-center text-white">
            Notifications
            {unreadCount > 0 && (
              <span className="text-xs bg-[#edb546] text-black px-2 py-0.5 rounded">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto text-sm">
            {recentNotifications.length === 0 ? (
              <div className="px-3 py-4 text-gray-400 text-center">No recent notifications</div>
            ) : (
              recentNotifications.map((notification, index) => {
                const { icon, bg, label } = notificationStyles[notification.type];
                return (
                  <div
                    key={index}
                    className="flex gap-2 px-3 py-2 items-start border-b border-[#2A2D3A] hover:bg-[#1F212A]"
                  >
                    <div
                      className="p-2 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: bg }}
                    >
                      {icon}
                    </div>

                    <div className="flex flex-col w-full text-white">
                      <p className="text-sm">{notification.title}</p>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>{label}</span>
                        <span>{getTimeAgo(notification.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

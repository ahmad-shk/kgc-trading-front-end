"use client";

import React, { useEffect, useState, useRef } from "react";
import { Bell, TrendingUp, TrendingDown } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

// Define status types
type NotificationStatus = "WINNER" | "LOSER";

// Notification interface
interface Notification {
  _id?: string;
  pool_id?: string;
  pool_porcessing_id?: string;
  order_id?: string;
  symbol?: string;
  user_id?: string;
  walletAddress?: string;
  amount?: number;
  calimable_amount?: number;
  profit_loss?: number;
  isClaimed?: boolean;
  expiry_time?: number;
  isExpired?: boolean;
  status?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Notification styles
const notificationStyles: Record<
  NotificationStatus,
  { icon: JSX.Element; bg: string; label: string }
> = {
  WINNER: {
    icon: <TrendingUp className="w-4 h-4 text-[#181A20]" />,
    bg: "#15b34c",
    label: "Win",
  },
  LOSER: {
    icon: <TrendingDown className="w-4 h-4 text-[#181A20]" />,
    bg: "#F87171",
    label: "Loss",
  },
};

// Time ago utility
function getTimeAgo(createdAt?: string): string {
  if (!createdAt) return "";
  const minutes = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
  return `${minutes} mins ago`;
}

export default function NotificationComponent() {
  const { orderRresults } = useSelector((state: RootState) => state?.pool) as {
    orderRresults?: Notification[];
  };

  const [open, setOpen] = useState(false);
  const [recentNotifications, setRecentNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (orderRresults?.length) {
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
      const seenOrderIds = new Set<string>();

      const recent = orderRresults
        ?.filter((n) => new Date(n?.createdAt || "").getTime() >= fiveMinutesAgo)
        ?.filter((n) => {
          if (!n?.order_id) return false;
          if (seenOrderIds.has(n.order_id)) return false;
          seenOrderIds.add(n.order_id);
          return true;
        });

      setRecentNotifications(recent || []);
    }
  }, [orderRresults]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef?.current && !dropdownRef?.current.contains(event?.target as Node)) {
        setOpen(false);
      }
    };
    document?.addEventListener("mousedown", handleClickOutside);
    return () => document?.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center justify-center">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full bg-[#edb546] hover:bg-[#edb546]/90"
      >
        <Bell className="w-5 h-5 text-black" />
        {recentNotifications?.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {recentNotifications.length}
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
            {recentNotifications?.length > 0 && (
              <span className="text-xs bg-[#edb546] text-black px-2 py-0.5 rounded">
                {recentNotifications.length} new
              </span>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto text-sm">
            {recentNotifications?.length === 0 ? (
              <div className="px-3 py-4 text-gray-400 text-center">No recent notifications</div>
            ) : (
              recentNotifications?.map((notification, index) => {
                const status = notification?.status;

                if (status !== "WINNER" && status !== "LOSER") return null;

                const { icon, bg } = notificationStyles[status];

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
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium">{notification?.symbol}</p>
                        <p className="text-sm font-medium">{status === "LOSER" ? "Loss" : "Win"}</p>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span className="truncate max-w-[180px]">{notification?.order_id}</span>
                        <span>{getTimeAgo(notification?.createdAt)}</span>
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

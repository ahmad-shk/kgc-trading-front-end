// app/context/AccountProvider.tsx

"use client";

import React, { createContext, useContext, ReactNode, useEffect } from "react";
import {
  useAppKitAccount,
  useDisconnect,
  type UseAppKitAccountReturn,
} from "@reown/appkit/react";

const AccountContext = createContext<UseAppKitAccountReturn | null>(null);

interface AccountProviderProps {
  children: ReactNode;
}

export const AccountProvider = ({ children }: AccountProviderProps) => {
  const { disconnect } = useDisconnect();
  const account = useAppKitAccount();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const query = new URLSearchParams(window.location.search);
      const referralCode = query.get("referralCode");
      // Optionally: save to state or log
    }
  }, []);

  return (
    <AccountContext.Provider value={account}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount must be used within AccountProvider");
  }
  return context;
};

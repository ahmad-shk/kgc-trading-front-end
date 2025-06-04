"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useAppKit, useDisconnect } from '@reown/appkit/react';
import { useAccount } from '@/config/context/AccountContext';
import { apiPost } from '@/lib/api';
import { clearUserData, setUserData } from '@/store/slices/userSlice';
import { useDispatch } from 'react-redux';
import axiosInstance from '@/lib/axios';
import { getAddress } from 'ethers';
import { fetchOrders } from '@/store/slices/orderSlice';
import { AppDispatch } from '@/store/store';
import { log } from 'console';
import { fetchPool } from '@/store/slices/poolSlice';
import { toast } from 'sonner';

const WalletButton = () => {
  const { open } = useAppKit();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [prevAddress, setPrevAddress] = useState<string | null>(null);
  const checksummed = address ? getAddress(address as string) : "Wallet not connected";

  useEffect(() => {
    if (address) {
      const checksummed = getAddress(address);
      if (prevAddress && prevAddress !== checksummed) {
        login()
      }
      setPrevAddress(checksummed)
    }
  }, [address]);

  useEffect(() => {
    console.log("lognnnnn")
    if (isConnected 
      // && prevAddress == null
    ) {
      login(); // Only login AFTER successful connection
    }
    if (!isConnected) {
      logout();
    }
  }, [isConnected]);

  const login = async () => {
    try {
      setLoading(true);
      const user = await apiPost('/auth/login', {
        walletAddress: checksummed
      });
      dispatch(setUserData(user));
      localStorage.setItem('token', user.access_token);
      dispatch(fetchOrders());
      dispatch(fetchPool())
      toast.success("Wallet Connected successfully")
      // axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${user.access_token}`;
    } catch (err) {
      logout();
      createAcount();
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const createAcount = async () => {
    try {
      setLoading(true);
      const user = await apiPost('/auth/account', {
        walletAddress: checksummed
      });
      dispatch(setUserData(user));
      localStorage.setItem('token', user.access_token);
      dispatch(fetchOrders());
      dispatch(fetchPool())
      login();
    } catch (err) {
      logout();
      console.error("Cretae account failed:", err);
    } finally {
      setLoading(false);
    }
  };
  const logout = async () => {
    // setLoading(true);
    // token clear from localStorage or axios
    localStorage.removeItem('token');
    axiosInstance.defaults.headers.common['Authorization'] = '';
    dispatch(clearUserData());
    // toast.error("Logout success")
  }

  const handleLoginClick = async () => {
    try {
      setLoading(true);
      await open();
    } catch (err) {
      console.error("Wallet connect failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {isConnected ? (
        <button
          onClick={() => disconnect()}
          className="bg-[#edb546] hover:bg-[#edb546]/90 text-black font-medium px-6 py-2 rounded-full text-sm border-2 border-[#edb546]"
        >
          Logout
        </button>
      ) : (
        <button
          onClick={handleLoginClick}
          disabled={loading}
          className="bg-[#edb546] hover:bg-[#edb546]/90 text-black font-medium px-6 py-2 rounded-full text-sm border-2 border-[#edb546] flex items-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Loading...
            </>
          ) : (
            "Log in"
          )}
        </button>
      )}
    </div>
  );
};

export default WalletButton;

"use client"

import React, { useEffect, useState } from "react"
import AmountInput from "./amountInput"
import PriceInput from "./PriceInput"
import { useSelector } from "react-redux"
import useOrderBook from "@/hooks/use-order-book-data"
import { apiPost } from "@/lib/api"
import { fetchOrders } from "@/store/slices/orderSlice"
import DottedLoader from "./loader"
import { LogIn } from "lucide-react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store/store"
import { toast } from "sonner"
import { Payment_Contract_Abi, Payment_Contract_Address, USDT_Contract_Abi, USDT_Contract_Address } from "@/config/contractABI"
import { BrowserProvider, Contract, ethers, JsonRpcProvider, Interface } from "ethers";
import { Eip1193Provider } from 'ethers/providers'; // for ethers v6+
import { useAppKitProvider } from "@reown/appkit/react";
import { useAccount } from "@/config/context/AccountContext"

interface TradePayload {
  symbol: string;
  amount: number;
  unit: string;
  order_type: string;
  leverage: number;
  transactionHash: string;
}
interface SubmitResult {
  success: boolean;
  message?: string;
  data?: any;
}
interface OrderPayload {
  symbol: string;
  order_type: "LONG" | "SHORT";
  amount: number;
  leverage: number;
  unit: string;
  transactionHash: string;
}

export default function TradingInterface() {
  const dispatch = useDispatch<AppDispatch>();
  const { walletProvider } = useAppKitProvider('eip155')
  const { isConnected } = useAccount();

  const { userBalance } = useSelector((state: any) => state.binance);
  const balance = userBalance?.usdt ?? '0';
  const balanceBNB = userBalance?.bnb ?? '0';
  const balanceAllowance = userBalance?.allowance ?? '0';
  const [loaderLong, setLoaderLong] = React.useState<boolean>(false);
  const [loaderShort, setLoaderShort] = React.useState<boolean>(false);
  const symbol = useSelector((state: any) => state.binance.symbol);
  const { orderBook, currentPrice, lastPrice } = useOrderBook(symbol, 1000);
  const [buyAmount, setBuyAmount] = useState<number>(0)
  const [sellAmount, setSellAmount] = useState<number>(0)
  const [buyPercentage, setBuyPercentage] = useState(5)
  const [sellPercentage, setSellPercentage] = useState(5)
  const [CurrencyType, setCurrencyType] = useState<string>("");
  const [coinName, setCoinName] = useState<string>("");
  const percentages = [5, 10, 15, 20, 25]
  const [buyPrice, setBuyPrice] = useState<string>("0");
  const [sellPrice, setSellPrice] = useState<string>("0");
  const [payloadLong, setPayloadLong] = useState<TradePayload>({ symbol: "", amount: 0, unit: "USDT", order_type: "", leverage: 5, transactionHash: "0xe736ae8cac865c596ba5fb463834c031c45baa9e9302767b2b51cce0baeaa8b1" });
  const [payloadShort, setPayloadShort] = useState<TradePayload>({ symbol: "", amount: 0, unit: "USDT", order_type: "", leverage: 5, transactionHash: "0xe736ae8cac865c596ba5fb463834c031c45baa9e9302767b2b51cce0baeaa8b1" });

  const setDataLong = (val: string | number, name: string, type: string) => {
    if (type === "Long") {
      setPayloadLong(prev => ({ ...prev, order_type: String("LONG") }));
      setPayloadLong(prev => ({ ...prev, symbol: String(symbol) }));
      if (name === "Amount") {
        setPayloadLong(prev => ({ ...prev, amount: Number(val) }));
      } else if (name === "Leverage") {
        setPayloadLong(prev => ({ ...prev, leverage: Number(val) }));
      }
    } else if (type === "Short") {
      setPayloadShort(prev => ({ ...prev, order_type: String("SHORT") }));
      setPayloadShort(prev => ({ ...prev, symbol: String(symbol) }));
      if (name === "Amount") {
        setPayloadShort(prev => ({ ...prev, amount: Number(val) }));
      } else if (name === "Leverage") {
        setPayloadShort(prev => ({ ...prev, leverage: Number(val) }));
      } else if (name === "Symbol") {
        setPayloadShort(prev => ({ ...prev, symbol: String(symbol) }));
      }
    } else {
      return;
    }
  };

  useEffect(() => {
    const formattedPrice = currentPrice?.toLocaleString(undefined, { maximumFractionDigits: 6 }) || "0";
    setBuyPrice(formattedPrice);
    setSellPrice(formattedPrice);
  }, [currentPrice]);

  useEffect(() => {
    if (!symbol) return;
    if (`${symbol}`.endsWith('USDT')) {
      setCoinName(symbol.replace('USDT', ''))
      setCurrencyType('USDT')
    } else if (`${symbol}`.endsWith('USDC')) {
      setCoinName(symbol.replace('USDC', ''))
      setCurrencyType('USDC')
    } else if (`${symbol}`.endsWith('BTC')) {
      setCoinName(symbol.replace('BTC', ''))
      setCurrencyType('BTC')
    } else if (`${symbol}`.endsWith('ETH')) {
      setCoinName(symbol.replace('ETH', ''))
      setCurrencyType('ETH')
    }
  }, [symbol]);

  const validateOrder = (payload: OrderPayload): SubmitResult => {
    const { symbol, order_type, amount, leverage, unit } = payload;

    if (isNaN(amount) || amount < 1)
      return { success: false, message: "Amount must be at least 1" };
    if (isNaN(amount) || amount >= balance)
      return { success: false, message: "you dont have enough USDT" };
    if (isNaN(amount) || balanceBNB <= 0.0015)
      return { success: false, message: "you dont have enough BNB (atleast 0.0016 BNB required!)" };
    if (isNaN(leverage) || leverage < 5)
      return { success: false, message: "Leverage must be at least 5" };
    if (unit !== "USDT") return { success: false, message: "Unit must be USDT" };
    if (!symbol) return { success: false, message: "Symbol is required" };
    if (!["LONG", "SHORT"].includes(order_type))
      return { success: false, message: "Order type must be LONG or SHORT" };
    return { success: true };
  };

  const submitOrder = async (payload: OrderPayload): Promise<SubmitResult> => {
    const validation = validateOrder(payload);
    if (!validation.success) return validation;

    try {
      // payload.order_type === "LONG" ? setLoaderLong(true) : setLoaderShort(true)
      const hash = await buyHandler(payload)
      console.log('res--->', hash)
      if (hash) {
        payload.transactionHash = hash
        const response = await apiPost("/order", payload);
        return { success: true, data: response };
      } else {
        return { success: false, data: null };
      }

    } catch (error: any) {
      const msg = error?.response?.data?.message || "Something went wrong";
      return { success: false, message: msg };
    }
    finally {
      setLoaderLong(false)
      setLoaderShort(false)
      const token = localStorage.getItem("token");
      if (token) {
        dispatch(fetchOrders());
      }
    }

  };

  const buyHandler = async (payload: any) => {
    const { amount } = payload;

    try {
      if (!isConnected) throw Error("User disconnected");
      const ethersProvider = new BrowserProvider(walletProvider as Eip1193Provider);
      const signer = await ethersProvider.getSigner();

      // The Contract object
      const tetherContract = new Contract(USDT_Contract_Address, USDT_Contract_Abi, signer);
      const presaleContract = new Contract(Payment_Contract_Address, Payment_Contract_Abi, signer);

      const amt = ethers.parseUnits(amount.toString(), 18);

      if (parseFloat(balanceAllowance) < parseFloat(amount)) {
        const amt1 = ethers.parseUnits(amount.toString(), 18);
        const tx1 = await tetherContract.approve(Payment_Contract_Address, amt1.toString())
        await tx1.wait();
      }

      const tx2 = await presaleContract.BuyWithUSDT(amt.toString());
      const resTxt2 = await tx2.wait();
      const { hash } = resTxt2;
      return hash

    } catch (error) {
      const erroObj = JSON.parse(JSON.stringify(error));
      toast.error(erroObj.shortMessage)
    }
  };

  const handleButtonClick = async (payload: any) => {
    const result = await submitOrder(payload);
    if (result.success) {
      toast.success("Order created successfully")
    } else {
      toast.error(result?.message)
    }

  };

  const handleShortClick = async (payload: any) => {
    const result = await submitOrder(payload);
    if (result.success) {
      toast.success("Order created successfully")
    } else {
      toast.error(result?.message)
    }
  };


  return (
    <div className="rounded-xl -border -border-gray-700 bg-[#181A20] pb-6 text-[#848E9C] mx-auto">
      {/* Buy Long Section */}
      <div className="grid grid-cols-2 gap-6 text-[14px] font-semibold text-[#edb546] pb-1 pt-5 px-5 border-b border-[#2B3139]">

        <h2>Buy Long</h2>
        <h2>Sell Short</h2>
      </div>
      <div className="px-5 pt-3 pb-5">
        <p className="text-[12px] text-[#edb546]">Balance: {balance} USDT</p>
      </div>
      {/* Price Input */}
      <div className="grid grid-cols-2 gap-6 px-5 text-[12px] max-[740px]:grid-cols-1 max-[740px]:grid-rows-2">
        <div>
          <PriceInput
            value={buyPrice}
            label="Price"
            unit={CurrencyType}
          />
          <div className="mb-6">
            <AmountInput
              value={buyAmount}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val)) {
                  setBuyAmount(val);
                  setDataLong(val, "Amount", "Long");
                }
              }}
              onValueChange={(val) => setDataLong(val, "Amount", "Long")}
              setValue={setBuyAmount}
              label="Amount"
            // unit={coinName}
            />
          </div>
          {/* Percentage Selector */}
          <div className="mb-4 flex relative items-center justify-between gap-2">
            {percentages.map((percent, index) => {
              const sizes = ["h-[16px] w-[16px]", "h-[14px] w-[14px]", "h-[12px] w-[12px]", "h-[10px] w-[10px]", "h-[8px] w-[8px]"];
              const size = sizes[index] || "h-[8px] w-[8px]"; // fallback if more items
              return (
                <div className="flex flex-col items-center relative z-[1] pt-[1px]"
                // key={ sell-${percent}}
                >
                  <button className={`${size} rotate-45 ${buyPercentage >= percent
                    ? "bg-[#edb546]"
                    : "border border-[#edb546]"
                    }`}
                    onClick={() => {
                      setBuyPercentage(percent);
                      setDataLong(percent, "Leverage", "Long");
                    }}
                  />
                  <span className="mt-1 text-[#848E9C]">{percent}%</span>
                </div>
              );
            })}
            <div className="absolute w-[90%] h-[2px] top-1/4 left-[5%] z-[0] bg-[#1F2128] -translate-y-1/2"></div>
          </div>
          {/* AVBL and Max Buy */}
          <div className="pb-2 pt-2.5 flex justify-between">
            <span className="text-[#848E9C]">AVBL</span>
            <span className="text-[#848E9C]">- {CurrencyType}</span>
          </div>
          <div className="pb-8 flex justify-between">
            <button className="text-[#848E9C] underline">Max Buy</button>
            <span className="text-[#848E9C]">-- {coinName}</span>
          </div>
          {/* Buy Button */}
          <button
            disabled={!isConnected}
            className="w-full rounded-xl bg-[#15b34c] py-3 text-center text-[14px] font-semibold text-white -text-[#848E9C] hover:bg-[#13a045]"
            onClick={() => handleButtonClick(payloadLong)}
          >
            {loaderLong ? <DottedLoader size="sm" color="blue" overlay={false} /> : "Long"}
          </button>
        </div>
        {/* Sell Short Section */}
        <div>
          <PriceInput
            value={sellPrice}
            label="Price"
            unit={CurrencyType}
          />
          <div className="mb-6">
            <AmountInput
              value={sellAmount}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val)) {
                  setSellAmount(val);
                  setDataLong(val, "Amount", "Short");
                }
              }}
              onValueChange={(val) => setDataLong(val, "Amount", "Short")}
              setValue={setSellAmount}
              label="Amount"
            // unit={coinName}
            />
          </div>
          {/* Percentage Selector */}
          <div className="mb-4 flex relative items-center justify-between gap-2">
            {percentages.map((percent: any, index) => {
              const sizes = ["h-[16px] w-[16px]", "h-[14px] w-[14px]", "h-[12px] w-[12px]", "h-[10px] w-[10px]", "h-[8px] w-[8px]"];
              const size = sizes[index] || "h-[8px] w-[8px]"; // fallback if more items

              return (
                <div
                  // key={sell-${percent}} 
                  className="flex flex-col items-center relative z-[1] pt-[1px]">
                  <button
                    className={`${size} rotate-45 ${sellPercentage >= percent
                      ? "bg-[#edb546]"
                      : "border border-[#edb546]"
                      }`}
                    onClick={() => {
                      setSellPercentage(percent);
                      setDataLong(percent, "Leverage", "Short");
                    }}
                  />
                  <span className="mt-1 text-[#848E9C]">{percent}%</span>
                </div>
              );
            })}
            <div className="absolute w-[90%] h-[2px] top-1/4 left-[5%] z-[0] bg-[#1F2128] -translate-y-1/2"></div>
          </div>
          {/* AVBL and Max Sell */}
          <div className="pb-2 pt-2.5 flex justify-between">
            <span className="text-[#848E9C]">AVBL</span>
            <span className="text-[#848E9C]">-- {coinName}</span>
          </div>
          <div className="pb-8 flex justify-between">
            <button className="text-[#848E9C] underline">Max Sell</button>
            <span className="text-[#848E9C]">- {CurrencyType}</span>
          </div>
          {/* Sell Button */}
          <button
            disabled={!isConnected}
            className="w-full rounded-xl bg-[#f6465d] py-3 text-center font-semibold text-[14px] text-white -text-[#848E9C] hover:bg-[#dc3545]" onClick={() => handleShortClick(payloadShort)}>
            {loaderShort ? <DottedLoader size="sm" color="blue" overlay={false} /> : "Short"}
          </button>
        </div>
      </div>
    </div>
  )
}
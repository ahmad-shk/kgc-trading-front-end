"use client";

import Image from "next/image";
import Link from "next/link";
import { useBinanceWebSocket } from "@/hooks/use-websocket";
import { useDispatch, useSelector } from "react-redux";
import WalletButton from "./wallet/WalletButton";
import { useAccount } from "@/config/context/AccountContext";
import { useEffect } from "react";
import { currentBalance, currentBalanceUSDT } from "@/config/Web3Controller";
import { balanceInnterface, setUserBalance } from "@/store/slices/binanceSlice";


const tradingPairs = [
  // USDT Pairs
  "BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT",
  "DOGEUSDT", "ADAUSDT", "DOTUSDT", "UNIUSDT", "LTCUSDT",
  "PEPEUSDT", "DOGSUSDT", "CKBUSDT", "FETUSDT", "FTMUSDT",
  "WIFUSDT", "AVAXUSDT", "TRXUSDT", "RUNEUSDT", "SEIUSDT",
  "AAVEUSDT", "STPTUSDT", "TAOUSDT", "ORDIUSDT", "TONUSDT",
  "SAGAUSDT", "NEARUSDT", "BOMEUSDT", "ZROUSDT", "EURUSDT",
  "ARBUSDT", "TWTUSDT", "PEOPLEUSDT", "ENAUSDT", "NOTUSDT",
  "TIAUSDT", "FLOKIUSDT", "SHIBUSDT", "LINKUSDT", "CRVUSDT",
  "WLDUSDT", "SUIUSDT", "BONKUSDT", "NEIROUSDT", "BCHUSDT",
  "TROYUSDT", "USDTTRY", "SUPERUSDT", "QUICKUSDT", "RAREUSDT",

  // Top BTC Pairs
  "ETHBTC", "BNBBTC", "SOLBTC", "XRPBTC", "DOGEBTC",
  "ADABTC", "AVAXBTC", "TRXBTC", "LINKBTC", "DOTBTC",

  // Top ETH Pairs
  "USDCETH", "WBTCETH", "SHIBETH", "UNIETH", "MATICETH",
  "LDOETH", "ARBETH", "AAVEETH",

  // Top USDC Pairs
  "BTCUSDC", "ETHUSDC", "SOLUSDC", "AVAXUSDC", "DOGEUSDC"
];


export default function Header() {
  const dispatch = useDispatch()
  useBinanceWebSocket(tradingPairs);
  const { symbol } = useSelector((state: any) => state.binance);
  const { address, isConnected } = useAccount();
  useEffect(() => {
    if (isConnected) {
      console.log('thererere====>address',address)
      getBalance()
    }
  }, [isConnected])

  const getBalance = async () => {

    try{

      console.log('thererere====>address')
      const balances = await currentBalance(address) as balanceInnterface;
      console.log('thererere====>address',balances)
      dispatch(setUserBalance(balances))
    }
    catch(e){
      console.log('thererere====>address error',e)
      console.log('ERROR::',e)
    }

  }


  return (
    <header className="border-b border-[#1f2128] py-6">
      <div className="app-container mx-auto flex items-center justify-between">

        {/* Left Side: Logo + Nav */}
        <div className="flex items-center gap-8">
          <Link href="/markets/overview" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="KGC Trading"
              width={100}
              height={36}
              className="h-9"
              priority
            />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href={`/trade/${symbol}`}
              className="text-[#edb546] hover:text-[#edb546]/80 text-sm"
            >
              Buy Crypto
            </Link>
            <Link
              href="/markets/overview"
              className="text-[#edb546] hover:text-[#edb546]/80 text-sm"
            >
              Markets
            </Link>
            <Link
              href="/about-us"
              className="text-[#edb546] hover:text-[#edb546]/80 text-sm"
            >
              About us
            </Link>
          </nav>
        </div>

        {/* Right Side: Login Button */}
        <WalletButton />

      </div>
    </header>
  );
}

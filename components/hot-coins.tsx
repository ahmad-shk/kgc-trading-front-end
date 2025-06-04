'use client';

import Image from "next/image";
// import { useEffect, useState } from "react";
import { redirect } from 'next/navigation';
import { useDispatch } from "react-redux";
import { setBinanceSymbol } from "@/store/slices/binanceSlice";
// import { useSelector } from "react-redux";


interface ICoinsProps {
  label: string;   
  coinList: Coin[]; 
}

interface Coin {
  symbol: string;
  lastPrice: number;
  priceChangePercent: number;
  quoteVolume: number;
  marketCap: number; 
  iconUrl: string;
}


const HotCoins = ({ label = 'Hot Coins', coinList = [] }: ICoinsProps) => {
  const dispatch = useDispatch();
  
  return (
    <div className="-bg-[#0b0d0f] border border-[#1f2128] rounded-2xl p-4 text-white text-[13px] max-h-[170px] w-full overflow-y-auto hide-scrollbar"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[14px] font-semibold text-[#EDB546]">
          {label}
        </h3>
        <button className="flex items-center gap-1 text-[12px] font-medium text-[#EDB546] hover:underline">
          More <span className="text-[14px]">➔</span>
        </button>
      </div>

      {/* Coin List */}
      <div className="flex flex-col gap-3">
        {         
          coinList.map((coin: any) => (

            <div
              onClick={() => {
                dispatch(setBinanceSymbol(coin.symbol))
                redirect(`/trade/${coin.symbol}`);
              }}

              key={coin.symbol} className="cursor-pointer flex items-center justify-between gap-4">

              {/* Left: Icon + Name */}
              <div className="flex items-center gap-2 min-w-[80px]">
                {/* {coin.iconUrl} */}
                <Image
                  src={coin.iconUrl}
                  alt={''}
                  width={24}
                  height={24}
                  className="rounded-full bg-white"                
                />
                <span className="text-[#EDB546] font-medium">
                  {coin.symbol.endsWith('USDT') ? coin.symbol.replace('USDT', '') :
                    coin.symbol.endsWith('USDC') ? coin.symbol.replace('USDC', '') :
                      coin.symbol.endsWith('BTC') ? coin.symbol.replace('BTC', '') :
                        coin.symbol.endsWith('ETH') ? coin.symbol.replace('ETH', '') : ''}
                </span>
              </div>

              {/* Middle: Price */}
              <div className="text-[#EDB546] min-w-[60px] text-center">
                {`$${parseFloat(coin?.lastPrice).toFixed(6)}`}
              </div>

              {/* Right: Change */}
              <div className={`${parseFloat(coin.priceChangePercent) >= 0 ? 'text-green-400' : 'text-red-400'} text-[12px] min-w-[50px] text-right`}>
                {`${parseFloat(coin.priceChangePercent).toFixed(2)}%`}
              </div>

            </div>

          ))}
      </div>
    </div>
  );
};

export default HotCoins;

'use client'


import TradingChart from "@/components/trading-chart"
import OrderBook from "@/components/order-book"
import MarketTrades from "@/components/market-trades"
import TopMovers from "@/components/top-movers"
import BinanceTicker from "@/components/binance-ticker"
import PageTitleUpdater from '@/components/page_title_updater';
import CryptoTable from "@/components/CryptoTable"
import Header from "@/components/header"
import TradePanel from "@/components/tradePanel"
import OrdersPanel from "@/components/OrdersPanel"
import { useParams } from "next/navigation"
import { useEffect, useLayoutEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { setBinanceSymbol } from "@/store/slices/binanceSlice"
import { useSelector } from "react-redux"
import useOrderBook from "@/hooks/use-order-book-data"

export default function Home() {
  const symbol = useSelector((state: any) => state.binance.symbol);
  const { orderBook, currentPrice, lastPrice } = useOrderBook(symbol, 1000);
  const [val, setVal] = useState("");

  useEffect(() => {
    setVal(
      currentPrice !== undefined && currentPrice !== null
        ? currentPrice.toLocaleString(undefined, { maximumFractionDigits: 6 })
        : '--'
    );
  }, [currentPrice]);

  const dispatch = useDispatch();
  // get id from url 
  const { pair }: any = useParams();
  useLayoutEffect(() => {
    if (pair) {
      dispatch(setBinanceSymbol(pair));
    }
  }, [pair]);

  return (
    <div className=" bg-[#090a0c] text-white">
      {/* Header */}
      <PageTitleUpdater
        price={val? val : "0"}
        coinName={symbol || "USDT"}
        anotherPage="buyCrypto"
      />
      {/* Main Content */}
      <main className="app-container py-8">
        {/* Trading Pair Info */}

        <div className="flex gap-3 max-[1330px]:flex-col">
          <div className="flex flex-col gap-3 grow">
            <BinanceTicker />

            {/* Trading Interface */}
            <div className="flex gap-3 max-[1048px]:flex-col-reverse">
              {/* Order Book */}
              <div className=" rounded-lg 2xl:min-w-[320px]">
                <OrderBook />
              </div>

              {/* Chart and Trading View */}
              <div className="flex flex-col gap-3 grow">
                <div className=" rounded-lg h-[450px]">
                  <TradingChart />
                </div>
                <div className=" rounded-lg">
                  <TradePanel />
                </div>
              </div>
            </div>
          </div>

          {/* Market Trades and Buy/Sell */}
          <div className="flex flex-wrap min-[1330px]:flex-col gap-3 max-[1048px]:">

            <div className="p-2.5 flex items-center rounded-2xl bg-[#181A20] -border -border-gray-800 grow max-[740px]:basis-[100%]">
              <CryptoTable />
            </div>
            <div className=" rounded-lg grow max-[1048px]:order-3 max-[1048px]:basis-[100%] 2xl:min-w-[320px]">
              <MarketTrades />
            </div>
            <div className=" rounded-lg grow">
              <TopMovers />
            </div>
          </div>
        </div>


        {/* Order History */}
        <div className="mt-6 text-center">
          <OrdersPanel />
        </div>

      </main>
      {/* 
      <Footer /> */}
    </div>
  )
}

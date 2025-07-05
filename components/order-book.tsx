"use client"

import { use, useEffect, useRef, useState } from "react"
import { MoreHorizontal } from "lucide-react"
import useOrderBook from "@/hooks/use-order-book-data";
import { useSelector } from "react-redux";


export default function OrderBook() {
  const symbol = useSelector((state: any) => state.binance.symbol);
  const [activeView, setActiveView] = useState(1)
  const { orderBook, currentPrice, lastPrice } = useOrderBook(symbol, 1000);
  const [orderBookData, setOrderBookData] = useState(orderBook);

  const [incOrDic, setIncOrDic] = useState(true);
  const lastPriceRef = useRef(currentPrice);

  useEffect(() => {
    if (currentPrice > lastPriceRef.current) {
      setIncOrDic(true);
    } else if (currentPrice < lastPriceRef.current) {
      setIncOrDic(false);
    }

    lastPriceRef.current = currentPrice;
  }, [currentPrice]);



  useEffect(() => {
    const newAsks =
      orderBook.asks.length >= 12
        ? orderBook.asks.slice(0, 12)
        : [...orderBook.asks, ...orderBookData.asks].slice(0, 12);

    const newBids =
      orderBook.bids.length >= 12
        ? orderBook.bids.slice(0, 12)
        : [...orderBook.bids, ...orderBookData.bids].slice(0, 12);

    setOrderBookData({
      asks: newAsks,
      bids: newBids,
    });
  }, [orderBook]);

  const formatNumber = (num: number) => {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(2) + 'M'; // Millions
    } else if (num >= 1_000) {
      return (num / 1_000).toFixed(2) + 'K'; // Thousands
    } else {
      return num.toFixed(2); // Less than 1000
    }
  };

  const calculateProgress = () => {
    const totalBuy = orderBookData.bids.reduce((acc: number, order: any) => acc + (order.total || 0), 0);
    const totalSell = orderBookData.asks.reduce((acc: number, order: any) => acc + (order.total || 0), 0);
    const total = totalBuy + totalSell;

    const buyPercent = total > 0 ? (totalBuy / total) * 100 : 0;
    const sellPercent = total > 0 ? (totalSell / total) * 100 : 0;

    return { buyPercent, sellPercent };
  };

  const { buyPercent, sellPercent } = calculateProgress();

  return (
    // <div className="hide-scrollbar rounded-xl border-2 border-gray-800 text-[14px] max-h-[900px] pb-4 flex flex-col justify-between overflow-y-scroll">
    <div className="hide-scrollbar rounded-xl bg-[#181A20] text-[14px] max-h-[900px] pb-4 flex flex-col justify-between overflow-y-scroll">

      <div className="border-b border-[#2B3139]">
        <div className="flex items-center justify-between px-4 py-1 pt-4">
          <h1 className="font-semibold text-[#edb546]">Order Book</h1>
          <button className="-text-white text-[#848E9C]">
            <MoreHorizontal size={20} />
          </button>
        </div>
        {/* <div className="border-b border-gray-800"></div> Added line */}
        <div className="border-b" style={{ borderColor: '#2B3139' }}></div> {/* Added line */}

      </div>

      <div className="grow">

        <div className="flex gap-2 px-4 py-2 bg-[#181A20]">
          <ViewToggle id={1} active={activeView === 1} onClick={() => setActiveView(1)} />
          <ViewToggle id={2} active={activeView === 2} onClick={() => setActiveView(2)} />
          <ViewToggle id={3} active={activeView === 3} onClick={() => setActiveView(3)} />
        </div>

        <div className="flex justify-between gap-8 px-4 pb-2 text-[12px] text-[#848E9C]">
          <div className="whitespace-nowrap">Price (USDT)</div>
          <div className="whitespace-nowrap text-left w-[100px]">Amount ({symbol.replace('USDT', '')})</div>
          <div className="text-right">Total</div>
        </div>

        <div className="px-4 ">
          {/* Sell orders (red) */}
          {orderBookData.asks?.length > 0 &&
            orderBookData.asks.slice(0, activeView === 1 ? 11 : activeView === 3 ? 17 : 0).map((order: any, index: number) => {
              const price = typeof order.price === 'number' ? formatNumber(order.price) : '0.00';
              const amount = typeof order.amount === 'number' ? formatNumber(order.amount) : '0.000000';
              const total = typeof order.total === 'number' ? formatNumber(order.total) : '0.0000';

              return (
                <div key={`sell-${index}`} className="flex justify-between py-1 ">
                  <div className="text-[#f6465d]">{order.price}</div>
                  <div className="text-[#edb546]">{amount}</div>
                  <div className="text-right text-[#edb546]">{total}</div>
                </div>
              );
            })}

          {/* Current price indicator */}
          <div className="flex items-center justify-between py-2 border-y border-[#2B3139]">
            <div className="flex items-center">
              <span className={`text-xl font-medium ${!incOrDic ? 'text-[#15b34c]' : 'text-[#f6465d]'}`}>
                {currentPrice ? currentPrice.toLocaleString(undefined, { maximumFractionDigits: 6 }) : '--'}
              </span>
              {currentPrice ? (
                <span className={`ml-1 ${!incOrDic ? 'text-[#15b34c]' : 'text-[#f6465d]'}`}>
                  {!incOrDic ? '↑' : '↓'}
                </span>
              ) : ''}
              {/* <span className="text-white ml-2">
              {currentPrice ? `$${(currentPrice * 1.0015).toFixed(2)}` : '--'}
            </span> */}
            </div>
          </div>

          {/* Buy orders (green) */}
          {
            orderBookData.bids?.length > 0 &&
            orderBookData.bids.slice(0, activeView === 1 ? 12 : activeView === 2 ? 17 : 0).map((order: any, index: number) => {
              const price = typeof order.price === 'number' ? formatNumber(order.price) : '0.00';
              const amount = typeof order.amount === 'number' ? formatNumber(order.amount) : '0.000000';
              const total = typeof order.total === 'number' ? formatNumber(order.total) : '0.0000';

              return (
                <div key={`buy-${index}`} className="flex justify-between py-1">
                  <div className="text-[#15b34c]">{order.price}</div> {/* green price */}
                  <div className="text-[#edb546]">{amount}</div>
                  <div className="text-right text-[#edb546]">{total}</div> {/* time if available */}
                </div>
              );
            })
          }
          {/* Progress bar */}

          <div className="px-4 py-3 mt-2">
            <div className="flex items-center justify-between text-sm mb-1">
              <div className="text-[#15b34c]">B {buyPercent.toFixed(2)}%</div>
              <div className="text-[#f6465d]">{sellPercent.toFixed(2)}% S</div>
            </div>
            <div className="flex h-1.5 w-full overflow-hidden rounded-full">
              <div className="bg-[#15b34c]" style={{ width: `${buyPercent}%` }}></div>
              <div className="bg-[#f6465d]" style={{ width: `${sellPercent}%` }}></div>
            </div>
          </div>

        </div>
      </div>
    </div>

  );


  function ViewToggle({ id, active, onClick }: { id: number; active: boolean; onClick: () => void }) {
    return (
      <button
        onClick={onClick}
        className={`flex h-6 w-6 items-center justify-center rounded ${active ? "bg-[#1f2128]" : "bg-transparent"}`}
      >
        <div className="relative">
          {/* Colored indicators */}
          {id === 1 && (
            <>
              <svg width="11" height="9" viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="4" height="4" fill="#F6465D" />
                <rect x="5" width="6" height="2" fill="#D9D9D9" />
                <rect x="5" y="3.5" width="6" height="2" fill="#D9D9D9" />
                <rect x="5" y="7" width="6" height="2" fill="#D9D9D9" />
                <rect y="5" width="4" height="4" fill="#15B34C" />
              </svg>


            </>
          )}
          {id === 2 && (
            <>
              <svg width="11" height="9" viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" width="6" height="2" fill="#D9D9D9" />
                <rect x="5" y="3.5" width="6" height="2" fill="#D9D9D9" />
                <rect x="5" y="7" width="6" height="2" fill="#D9D9D9" />
                <rect width="4" height="9" fill="#15B34C" />
              </svg>

            </>
          )}
          {id === 3 && (
            <>
              <svg width="11" height="9" viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" width="6" height="2" fill="#D9D9D9" />
                <rect x="5" y="3.5" width="6" height="2" fill="#D9D9D9" />
                <rect x="5" y="7" width="6" height="2" fill="#D9D9D9" />
                <rect width="4" height="9" fill="#F6465D" />
              </svg>

            </>
          )}
        </div>
      </button>
    )
  }
}

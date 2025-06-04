'use client'

import { useEffect, useState } from "react";


const OrderBook = ({ symbol = "ETHUSDT" }) => {
    const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });

    const fetchOrderBook = async (symbol = "ETHUSDT", limit = 10) => {
        try {
            const response = await fetch(
                `https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=${limit}`
            );
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching order book:", error);
            return null;
        }
    };

    const subscribeToOrderBook = (symbol, onUpdate) => {
        const ws = new WebSocket(
            `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth`
        );

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            onUpdate(data);
        };

        return () => ws.close(); // Cleanup function to close WebSocket
    };

    useEffect(() => {
        // Fetch initial order book snapshot
        fetchOrderBook(symbol, 10).then((data) => setOrderBook(data));

        // Subscribe to real-time updates

        const unsubscribe = subscribeToOrderBook(symbol, (update) => {
            setOrderBook((prev) => ({
                bids: update.b ? [...prev.bids, ...update.b].sort((a, b) => a[0] - b[0]).slice(-100) : prev.bids,
                asks: update.a ? [...prev.asks, ...update.a].sort((a, b) => a[0] - b[0]).slice(-100) : prev.asks,
            }));
        });

        return unsubscribe; // Cleanup WebSocket on unmount
    }, [symbol]);

    return (
        <div className="  rounded shadow-lg">
            <div className="p-2">
                <h2 className="text-lg ">Order Book</h2>
                <div className="grid grid-cols-1 gap-4">
                    <div className="grid-cols-12">
                        <h3 className="text-lg font-semibold text-red-500">{'Asks'}</h3>
                        <div className="flex justify-between text-gray-400" >
                            <span>{'Price'}</span> <span>{'Qty'}</span>
                        </div>
                        {orderBook.asks?.sort((a, b) => a[0] - b[0]).slice(-15).map(([price, qty], index) => (
                            <div key={index} className="flex justify-between text-red-400">
                                <span>{price ? parseFloat(price).toFixed(4) : null}</span>
                                <span>{qty ? parseFloat(qty).toFixed(4) : null}</span>
                            </div>
                        ))}
                    </div>
                    <div className="grid-cols-12">
                        <h3 className="text-lg font-semibold text-green-500">{'Bids'}</h3>
                        <div className="flex justify-between text-gray-400" >
                            <span>{'Price'}</span> <span>{'Qty'}</span>
                        </div>
                        {orderBook.bids?.sort((a, b) => b[0] - a[0]).slice(-15).map(([price, qty], index) => (
                            <div key={index} className="flex justify-between text-green-400" >
                                <span>{price ? parseFloat(price).toFixed(4) : null}</span>
                                <span>{qty ? parseFloat(qty).toFixed(4) : null}</span>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default OrderBook;

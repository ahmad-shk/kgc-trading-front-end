// TradingViewWidget.jsx
import React, { useEffect, useRef, memo } from 'react';
import { useSelector } from 'react-redux';
// import { useSelector } from 'react-redux';

function TradingViewWidget() {
  const container = useRef();
  const symbol = useSelector((state) => state.binance.symbol);

  useEffect(() => {
    if (!container.current) return;
  
    // Clear any existing scripts or child elements in the container
    container.current.innerHTML = '';
  
    // Create a new script element for the TradingView Advanced Chart widget
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: `BINANCE:${symbol}`,
      interval: "15",
      timezone: "Etc/UTC",
      // theme: theme === 'dark' ? "dark" : "light",
      theme: "dark",
      style: "1",
      locale: "en",
      backgroundColor: "#181A20",
      withdateranges: true,
      hide_side_toolbar: false,
      allow_symbol_change: false,
      details: false,
      hotlist: false,
      calendar: false,
      show_popup_button: true,
      popup_width: "1000",
      popup_height: "100px",
      support_host: "https://www.tradingview.com"
    });
  
    // Append the script to the container
    container.current.appendChild(script);
  
    // Cleanup function to remove the script when `coinSymbol` changes or component unmounts
    return () => {
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [symbol]);
  

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: "450px", width: "100%" }}>
      <div className="tradingview-widget-container__widget" style={{ height: "calc(800px - 32px)", width: "100%" }}></div>
      <div className="tradingview-widget-copyright"><a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span className="blue-text"></span></a></div>
    </div>
  );
}

export default memo(TradingViewWidget);

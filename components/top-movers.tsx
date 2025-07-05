"use client"

import { useSelector } from "react-redux";


const downArrow = (
  <svg width="40" height="17" viewBox="0 0 40 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="17" rx="4" fill="#F6465D" />
    <path d="M15.1095 5.40397C14.8054 5.27232 14.4521 5.41212 14.3205 5.71621C14.1888 6.02031 14.3286 6.37355 14.6327 6.50521L15.1095 5.40397ZM26.1042 11.28C26.4123 11.1581 26.5632 10.8094 26.4413 10.5013L24.4542 5.48021C24.3323 5.17209 23.9836 5.02115 23.6755 5.14309C23.3674 5.26503 23.2165 5.61366 23.3384 5.92178L25.1047 10.385L20.6415 12.1513C20.3334 12.2732 20.1825 12.6218 20.3044 12.93C20.4263 13.2381 20.775 13.389 21.0831 13.2671L26.1042 11.28ZM14.8711 5.95459L14.6327 6.50521L25.645 11.2727L25.8834 10.7221L26.1218 10.1715L15.1095 5.40397L14.8711 5.95459Z" fill="#EDB546" />
  </svg>

)

const upArrow = (
  <svg width="40" height="17" viewBox="0 0 40 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="17" rx="4" fill="#15B34C" />
    <path d="M14.7338 10.4623C14.4368 10.6093 14.3153 10.9692 14.4623 11.2662C14.6093 11.5632 14.9692 11.6847 15.2662 11.5377L14.7338 10.4623ZM26.3229 5.86826C26.4289 5.55431 26.2604 5.21385 25.9464 5.10781L20.8304 3.37977C20.5164 3.27373 20.176 3.44227 20.0699 3.75622C19.9639 4.07016 20.1324 4.41063 20.4464 4.51667L24.994 6.0527L23.4579 10.6003C23.3519 10.9142 23.5204 11.2547 23.8344 11.3607C24.1483 11.4668 24.4888 11.2982 24.5948 10.9843L26.3229 5.86826ZM15 11L15.2662 11.5377L26.0206 6.21398L25.7544 5.67625L25.4882 5.13853L14.7338 10.4623L15 11Z" fill="#EDB546" />
  </svg>

)


interface Coin {
  symbol: string;
  lastPrice: number;
  priceChangePercent: number;
  quoteVolume: number;
  marketCap: number;
  iconUrl: string;
}

export default function TopMovers() {
  const { hotCoins } = useSelector((state: any) => state.binance);
  return (
    <div className="h-full flex flex-col bg-[#181A20] -border -border-gray-800 rounded-xl">
      <div className="flex items-center justify-between px-3 pb-1 pt-4 border-b border-[#2B3139] rounded-t-xl">
        <h3 className="font-semibold text-[#edb546] pb-2">Top Movers</h3>
        <button className="text-[#6f6a6b] pb-2  hover:text-white">
          <svg width="10" height="13" viewBox="0 0 10 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.99324 5.99603C5.25857 5.99603 5.51388 5.8909 5.70111 5.70367L9.70604 1.70674C9.89339 1.51887 9.99842 1.26427 9.99805 0.998959C9.99767 0.733643 9.89191 0.479344 9.70404 0.292003C9.51617 0.104662 9.26157 -0.000374532 8.99626 1.00353e-06C8.73094 0.000376539 8.47664 0.106133 8.2893 0.294005L4.99224 3.58406L1.69518 0.294005C1.55428 0.158425 1.3768 0.0670206 1.1846 0.0310527C0.992407 -0.00491516 0.793884 0.0161238 0.613495 0.0915788C0.433105 0.167034 0.278728 0.293609 0.16938 0.45571C0.0600328 0.617811 0.000491142 0.808359 -0.00191021 1.00388C-0.00432587 1.26588 0.096364 1.51833 0.278434 1.70674L4.28337 5.70367C4.47156 5.89123 4.72754 5.99639 4.99324 5.99603Z" fill="#EDB546" />
            <path d="M4.99324 12.9941C5.25857 12.9941 5.51388 12.8889 5.70111 12.7017L9.70604 8.70479C9.89339 8.51692 9.99842 8.26232 9.99805 7.99701C9.99767 7.73169 9.89191 7.47739 9.70404 7.29005C9.51617 7.10271 9.26157 6.99767 8.99626 6.99805C8.73094 6.99842 8.47664 7.10418 8.2893 7.29205L4.99224 10.5821L1.69518 7.29205C1.55428 7.15647 1.3768 7.06507 1.1846 7.0291C0.992407 6.99313 0.793884 7.01417 0.613495 7.08963C0.433105 7.16508 0.278728 7.29166 0.16938 7.45376C0.0600328 7.61586 0.000491142 7.80641 -0.00191021 8.00193C-0.00432587 8.26393 0.096364 8.51637 0.278434 8.70479L4.28337 12.7017C4.47156 12.8893 4.72754 12.9944 4.99324 12.9941Z" fill="#EDB546" />
          </svg>
        </button>
      </div>

      <div className="flex px-3 py-2 text-[#848E9C] text-[10px]">
        <div className="w-1/3">All</div>
        <div className="w-1/3 text-center">Change</div>
        <div className="w-1/3 text-right">New High/Low</div>
      </div>

      <div className="flex flex-col pt-1 overflow-y-scroll max-h-[100px]">
        {hotCoins.map((item: Coin, i: any) => (
          <div key={i} className="flex justify-between items-center px-3 -pb-1 text-[10px] hover:bg-[#1f2128]/50" >
            <div className="flex flex-col">
              <span className="text-[#EDB546]">{`${item.symbol.replace('USDT', '')}/USDT`}</span>
              <span className=" text-[8px]">[1min] Small Bias</span>
            </div>
            <div className={item.priceChangePercent >= 0 ? "text-[#15b34c]" : "text-[#f6465d]"}>{item.priceChangePercent}</div>
            <div>
              {item.priceChangePercent >= 0 ? upArrow : downArrow}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

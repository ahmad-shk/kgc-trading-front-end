import useTickerData from "@/hooks/use-ticker-data";
import { SquareIcon } from "lucide-react"


export default function TokenInfoCard({
  tokenPair = "BNB/USDT",
  price = "596.51",
  dollarPrice = "$596.51",
  change = "-15.10 -2.7%",
  high = "614.20",
  low = "592.59",
  volumeBNB = "279,831.09",
  volumeUSDT = "169,488,488.40",
  tags = "Layer 1 / Layer 2 | BND Chain | Voll Hot",
}) {


  return (
    <div className="w-full bg-[#1f2128] rounded-lg px-3 py-2 shadow-lg">
      <div className="flex items-center justify-between text-white text-sm">
        <div className="flex items-center gap-1">
          <button className="">
            <SquareIcon />
          </button>

          <div className="flex flex-col">
            <span className="text-[#edb546] text-base font-bold">{tokenPair}</span>
            <span className="text-[#edb546] text-xs">BNB Price</span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-[#f6465d] text-base font-bold">{price}</span>
          <span className="text-[#edb546] text-xs">{dollarPrice}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-400 text-xs">24h Change</span>
          <span className="text-[#f6465d] text-xs">{change}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-400 text-xs">24h High</span>
          <span className="text-white text-xs">{high}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-400 text-xs">24h Low</span>
          <span className="text-white text-xs">{low}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-400 text-xs">24h Volume (BNB)</span>
          <span className="text-white text-xs">{volumeBNB}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-400 text-xs">24h Volume (USDT)</span>
          <span className="text-white text-xs">{volumeUSDT}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-400 text-xs">Token Tags</span>
          <span className="text-[#edb546] text-xs">{tags}</span>
        </div>
      </div>
    </div>
  );
}

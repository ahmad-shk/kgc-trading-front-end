"use client";

import { setBinanceSymbol } from "@/store/slices/binanceSlice";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

type TokenRowProps = {
  coin: string;
  img: string;
  price: string;
  change: string;
  volume: string;
  marketCap: string;
  arrow: string;
};

export default function TokenRow({ coin, img, price, change, volume, marketCap, arrow }: TokenRowProps) {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleClick = () => {
    dispatch(setBinanceSymbol(coin));
    router.push(`/trade/${coin}`);
  };

  return (
    <tr
      className="border-b border-[#3b3d42] last:border-0 cursor-pointer text-center hover:bg-[#1a1a1a]"
      onClick={handleClick}
    >
      <td className="py-4 px-2 sm:px-4">
        <div className="flex items-center justify-center gap-2">
          <Image src={img} alt={coin} width={24} height={24} className="rounded-full" />
          <span className="text-[#EDB546] font-medium text-sm sm:text-base">{coin}</span>
        </div>
      </td>
      <td className="py-4 px-2 sm:px-4 text-[#EDB546] font-medium text-sm sm:text-base">{price}</td>
      <td className={`py-4 px-2 sm:px-4 font-medium text-sm sm:text-base ${change.startsWith('-') ? 'text-red-500' : 'text-[#15b34c]'}`}>
        {change}
      </td>
      <td className="py-4 px-2 sm:px-4 text-[#EDB546] font-medium text-sm sm:text-base">{volume}</td>
      <td className="py-4 px-2 sm:px-4 text-[#EDB546] font-medium text-sm sm:text-base">{marketCap}</td>
      <td className="py-4 px-2 sm:px-4">
        <Image
          src={arrow}
          alt="arrow"
          width={20}
          height={20}
          onClick={(e) => {
            e.stopPropagation();
            dispatch(setBinanceSymbol(coin));
            router.push(`/trade/${coin}`);
          }}
          className="inline-block cursor-pointer"
        />
      </td>
    </tr>
  );
}

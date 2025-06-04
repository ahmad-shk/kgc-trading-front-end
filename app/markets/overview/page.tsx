'use client'
import { ArrowRight } from "lucide-react";
import Footer from "@/components/footer";
import Header from "@/components/header";
import HotCoins from "@/components/hot-coins";
import BinanceCryptoTable from "@/components/crypto-table";
import { useSelector } from "react-redux";
import PageTitleUpdater from "@/components/page_title_updater";

export default function Home() {
  const { coins, topGainers, topVolume, hotCoins } = useSelector((state: any) => state.binance);
  return (
    <div className="min-h-screen bg-[#090a0c] text-white">
      {/* Header */}
      {/* <Header />
        <PageTitleUpdater
        anotherPage="Market Place"
      /> */}

      {/* Main Content */}
      <main className="app-container mx-auto py-8 sm">
        {/* Market Overview */}
        <section className="mb-12">
          <h2 className="text-3xl text-[#EDB546] font-bold mb-6">Market Overview</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <HotCoins label={'Hot Coins'} coinList={hotCoins} />
            </div>
            <div className="space-y-4">
              <HotCoins label={'Top Gainers'} coinList={topGainers} />
            </div>
            <div className="space-y-4">
              <HotCoins label={'Top Volume'} coinList={topVolume} />
            </div>
          </div>
        </section>

        {/* Top Tokens by Market Capitalization */}
        {/* <section className="mb-12">
          <div className="border border-[#2a2a2a] rounded-2xl p-8">
            <h2 className="text-3xl text-[#EDB546] font-bold mb-4">Top Tokens by Market Capitalization</h2>
            <p className="text-gray-300 mb-6">
              Lorem ipsum dolor sit amet consectetur. Vulputat volutpat tempus erat maecenas congue nam in.
              Orci euismod non turpis sapien tellus ipsum. Orci laoreet lacinia dui lacinia eget.
            </p>
            <button className="flex items-center text-[#EDB546] text-sm hover:underline">
              Show More <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </section> */}

        {/* Token Table */}
        <section>
          <div className="-border border-[#2a2a2a] rounded-2xl py-8">
            <div className="overflow-x-auto">
              <BinanceCryptoTable />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
}

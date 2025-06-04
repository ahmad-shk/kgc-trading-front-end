"use client";
interface PriceInputProps {
  value: string | number; 
  label?: string;
  unit?: string; 
}

export default function PriceInput({
  value,
  label = "Price",
  unit = "USDT",
}: PriceInputProps) {

  return (
    <div className="flex overflow-hidden rounded border border-gray-700 mb-4">
      <div className="flex-1 px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <label className="-text-white text-[#848E9C]">{label}</label>
          <div className="flex items-center">
            <input
              type="text"
              value={Number.isNaN(value) ? 0 : value}
              className="bg-transparent text-right text-[#edb546] outline-none w-24 sm:w-32"
            />
            <span className="ml-1 text-[#edb546]">{unit}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
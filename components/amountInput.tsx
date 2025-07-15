"use client";

import { useState } from "react";
import { IncrimentIcon, IconDic } from "./svg";
import { useSelector } from "react-redux";

interface AmountInputProps {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  unit?: string;
  setValue?: (value: number) => void;
  onValueChange?: (val: number) => void;
}

export default function AmountInput({
  value,
  onChange,
  label = "Amount",
  unit = "USDT",
  setValue,
  onValueChange,
}: AmountInputProps) {
  const MIN_VALUE = 5;
  const { userBalance } = useSelector((state: any) => state.binance);
  const USER_BALANCE = userBalance?.usdt ?? '0';
  const [errorMsg, setErrorMsg] = useState("");

  const numericValue = isNaN(Number(value)) ? 0 : Number(value);

  const incrementValue = () => {
    const newValue = numericValue + 1;

    if (newValue >= USER_BALANCE) {
      setErrorMsg("You have not enough USDT");
    } else {
      setErrorMsg(""); // ✅ Clear error
      setValue?.(newValue);
      onValueChange?.(newValue);
    }
  };

  const decrementValue = () => {
    const newValue = numericValue - 1;

    if (newValue < MIN_VALUE) {
      setErrorMsg("Min bid 5$");
      setValue?.(MIN_VALUE);
      onValueChange?.(MIN_VALUE);
    } else {
      setErrorMsg(""); // ✅ Clear error
      setValue?.(newValue);
      onValueChange?.(newValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);

    if (!isNaN(val)) {
      if (val < MIN_VALUE) {
        setErrorMsg("Min bid 5$");
      } else if (val > USER_BALANCE) {
        setErrorMsg("You have not enough balance");
      } else {
        setErrorMsg(""); // ✅ Valid value
      }
    } else {
      setErrorMsg("");
    }

    onChange(e);
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex overflow-hidden rounded border border-gray-700">
        <div className="flex-1 px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <label className="-text-white text-[#848E9C]">{label}</label>
            <div className="flex items-center">
              <input
                type="text"
                placeholder="0"
                value={value}
                onChange={handleInputChange}
                className="bg-transparent text-right text-[#edb546] placeholder-[#edb546] outline-none w-24 sm:w-32"
              />
              <span className="ml-1 text-[#edb546]">{unit}</span>
            </div>
          </div>
        </div>
        <div className="flex w-8 flex-col border-l border-gray-700 justify-center items-center">
          <button className="flex-1 hover:bg-[#0e0f12]/80" onClick={incrementValue}>
            <div className="mx-auto text-[#848E9C]">
              <IncrimentIcon />
            </div>
          </button>
          <button className="flex-1 border-t border-gray-700 hover:bg-[#0e0f12]/80" onClick={decrementValue}>
            <div className="mx-auto text-white">
              <IconDic />
            </div>
          </button>
        </div>
      </div>

      {errorMsg && (
        <p className="text-[10px] font-normal text-red-500 px-1 mt-1">{errorMsg}</p>
      )}
    </div>
  );
}

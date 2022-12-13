import { ethers } from "ethers";
import React, { FC, ReactNode } from "react";
import { Input } from "../../Input";

interface IExchangeItemProps {
  balance?: ethers.BigNumber;
  label?: ReactNode;
  inputValue?: string;
  handleInputChange?: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void;
  handleInputBlur?: () => void;
}

export const ExchangeItem: FC<IExchangeItemProps> = ({
  balance,
  label,
  inputValue,
  handleInputChange,
  handleInputBlur
}) => {
  const newBalance = ethers.utils.formatEther(balance || '') 
  
  return (
    <div className="bg-violet-50 rounded-xl p-4">
      <Input
        onChange={handleInputChange}
        value={inputValue}
        className="text-3xl text-slate-700"
        placeholder="0"
        endAdornment={label}
        onBlur={handleInputBlur}
      />
      <div className="mt-2 text-end text-slate-500">
        balance: {parseFloat(Number(newBalance).toFixed(5))}
      </div>
    </div>
  );
};

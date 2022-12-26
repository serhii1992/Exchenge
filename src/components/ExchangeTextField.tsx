import { ethers } from "ethers";
import React, { FC, ReactNode } from "react";
import { Button } from "./Button";
import { Input } from "./Input";

interface IExchangeTextFieldProps {
  balance?: ethers.BigNumber;
  label?: ReactNode;
  defaultLabel?: ReactNode;
  inputValue?: string;
  handleInputChange?: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void;
  handleInputBlur: (event: React.FocusEvent<HTMLInputElement, Element>) => void;
  onClick?: () => void;
}

export const ExchangeTextField: FC<IExchangeTextFieldProps> = ({
  balance,
  label,
  inputValue,
  defaultLabel = "Select token",
  handleInputChange,
  handleInputBlur,
  onClick,
}) => {
  const newBalance = ethers.utils.formatEther(balance || "0");

  return (
    <div className="bg-violet-50 rounded-xl p-4">
      <Input
        onChange={handleInputChange}
        value={inputValue}
        className="text-3xl text-slate-700"
        placeholder="0"
        endAdornment={
          <div className="flex shrink-0">
            <Button className="text-lg" appearance="secondary" onClick={onClick} type={"button"}>
              {label ? label : defaultLabel}
            </Button>
          </div>
        }
        onBlur={handleInputBlur}
      />
      <div className="mt-2 text-end text-slate-500">
        balance: {parseFloat(Number(newBalance).toFixed(5))}
      </div>
    </div>
  );
};

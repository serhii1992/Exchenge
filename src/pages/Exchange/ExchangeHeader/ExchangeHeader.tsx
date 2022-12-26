import React, { useState, FC } from "react";
import { ReactComponent as Settings } from "../../../assets/images/settings.svg";
import { Dropdown } from "../../../components/Dropdown";
import { Input } from "../../../components/Input";

interface IExchangeHeaderProps {
  handleSlippageChange?: (value: string) => void;
  slippage?: string
}

export const ExchangeHeader: FC<IExchangeHeaderProps> = ({handleSlippageChange, slippage}) => {
  const [value, setValue] = useState(slippage);

const handleBlure =() =>{
  handleSlippageChange && handleSlippageChange(value || "")
}

  return (
    <div className="my-2 px-2 flex items-center justify-between">
      <span className="font-medium">Exchange</span>
      <Dropdown target={<Settings className="cursor-pointer" />}>
        <div className="w-80 bg-white  rounded-md p-3 border border-slate-400">
          <div className="font-semibold mb-2">Setting</div>
          <div className="mb-2">Permissible slippage</div>
          <div>
            <Input
              inputType={"secondary"}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
              onBlur={handleBlure}
              endAdornment={<span className="font-medium p-1">%</span>}
            />
          </div>
        </div>
      </Dropdown>
    </div>
  );
};

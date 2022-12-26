import React, { FC } from "react";

interface ITokenItemProps {
  symbol: string;
  active: boolean;
  onClick?: ()=> void
}

export const TokenItem: FC<ITokenItemProps> = ({ symbol, active, onClick }) => {
  return (
    <div
      className={`px-2 py-1 text-lg font-medium rounded-2xl cursor-pointer ${
        active ? "border border-blue-400 bg-blue-200" : "border border-slate-300 bg-transparent"
      }`}
      onClick={onClick}
    >
      {symbol}
    </div>
  );
};

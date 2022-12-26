import React, { FC } from "react";
import { IPair, IToken } from "../../types/tokens";
import { Input } from "../Input";
import { TokenItem } from "./TokenItem";
import useModalContext from "../../hooks/useModalContext";
import { modalType } from "../../context/modalContext";
import useWalletContext from "../../hooks/useWalletContext";

interface ITokenSelectionProps {
  handleClose?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  longTokenList?: IToken[];
  shortTokenList?: IToken[];
  handleClickToken?: (token: IToken) => void;
  pair?: IPair;
  LPToken?: IToken | null
}

export const TokenSelection: FC<ITokenSelectionProps> = ({
  handleClose,
  onChange,
  value,
  longTokenList,
  shortTokenList,
  handleClickToken,
  pair,
  LPToken
}) => {
  const { type } = useModalContext();

  return (
    <div className="">
      <div className="p-5 border-b border-slate-300">
        <div className="flex items-center justify-between mb-4">
          <span className="font-semibold">Select token</span>
          <span className="hover:text-red-400 cursor-pointer" onClick={handleClose}>
            X
          </span>
        </div>
        <div className="mb-4">
          <Input
            className="h-10"
            inputType="secondary"
            placeholder="Search by name or insert address"
            value={value}
            onChange={onChange}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {shortTokenList?.map((token, i) => {
            return (
              <TokenItem
                key={i}
                active={
                  (type === modalType.AMOUNT_IN && pair?.token0?.address === token.address) ||
                  (type === modalType.AMOUNT_OUT && pair?.token1?.address === token.address)||
                  (type === modalType.AMOUNT_IN_LP && LPToken?.address === token.address)
                }
                symbol={token.symbol}
                onClick={() => {
                  handleClickToken && handleClickToken(token);
                }}
              />
            );
          })}
        </div>
      </div>
      <div className="py-5 overflow-y-scroll h-72 p-4">
        {longTokenList?.map((token, i) => {
          return (
            <div className="mb-2" key={i}>
              <TokenItem
                active={
                  (type === modalType.AMOUNT_IN && pair?.token0?.address === token.address) ||
                  (type === modalType.AMOUNT_OUT && pair?.token1?.address === token.address)||
                  (type === modalType.AMOUNT_IN_LP && LPToken?.address === token.address)
                }
                symbol={token.name}
                onClick={() => {
                  handleClickToken && handleClickToken(token);
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

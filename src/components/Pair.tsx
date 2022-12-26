import React, { FC } from "react";
import { BigNumber, ethers } from "ethers";
import { ExchangeTextField } from "./ExchangeTextField";
import { ReactComponent as Arrow } from "../assets/images/arrow.svg";
import { modalType } from "../context/modalContext";
import useModalContext from "../hooks/useModalContext";
import useWalletContext from "../hooks/useWalletContext";
import { IToken } from "../types/tokens";
import { removeDot } from "../utils/onlyNumbers";
import { useExchangeInput } from "../pages/Exchange/hooks/useExchangeInput";

type InputTypes = {
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (event: React.FocusEvent<HTMLInputElement, Element>) => void;
  value: string;
  label?: string;
  balance?: BigNumber;
};

interface IPairProps {
  inputIn: InputTypes;
  inputOut: InputTypes;
}

export const Pair: FC<IPairProps> = ({ inputIn, inputOut }) => {
  const { pair, setPair } = useWalletContext();
  const { setModal, type } = useModalContext();

  const pairRevers = () => {
    setPair({
      ...pair,
      token0: pair?.token1 as IToken,
      token1: pair?.token0 as IToken,
    });
  };

  return (
    <>
      <ExchangeTextField
        handleInputChange={inputIn.handleChange}
        inputValue={inputIn.value}
        balance={inputIn.balance as ethers.BigNumber}
        label={inputIn.label}
        handleInputBlur={inputIn.handleBlur}
        onClick={() => {
          setModal({ type: modalType.AMOUNT_IN });
        }}
      />
      <div
        onClick={pairRevers}
        className="flex justify-center items-center h-10 w-10 rounded-xl border-4 border-white bg-violet-100 mx-auto -mt-4 -mb-4 cursor-pointer relative"
      >
        <Arrow />
      </div>
      <ExchangeTextField
        handleInputChange={inputOut.handleChange}
        inputValue={inputOut.value}
        balance={inputOut.balance as ethers.BigNumber}
        label={inputOut.label}
        handleInputBlur={inputOut.handleBlur}
        onClick={() => {
          setModal({ type: modalType.AMOUNT_OUT });
        }}
      />
    </>
  );
};

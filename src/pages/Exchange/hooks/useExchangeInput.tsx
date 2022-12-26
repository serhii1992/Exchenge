import { ethers } from "ethers";
import React, { useState } from "react";
import useWalletContext from "../../../hooks/useWalletContext";
import { onlyNumbers } from "../../../utils/onlyNumbers";
import { useCheckPairExist } from "./useCheckPairExist";
import { useSwap } from "./useSwap";

export const useExchangeInput = () => {
  const [amountInValue, setAmountInValue] = useState("");
  const [amountOutValue, setAmountOutValue] = useState("");
  const [amountInLPValue, setAmountInLPValue] = useState("");
  const { LPToken } = useWalletContext();
  const { getAmountsOut } = useSwap();
  const { isWrapPair } = useCheckPairExist();

  const handleAmountInLPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (LPToken?.totalSupply) {
      const value = onlyNumbers(e.target.value);
      setAmountInLPValue(value);

      const reserves0 = ethers.utils.formatEther(LPToken.reserves[0].toString());
      const reserves0ToNumber = Number(reserves0.toString());

      const reserves1 = ethers.utils.formatEther(LPToken.reserves[1].toString());
      const reserves1ToNumber = Number(reserves1.toString());

      const totalSupply = ethers.utils.formatEther(LPToken?.totalSupply.toString());
      const totalSupplyToNumber = Number(totalSupply.toString());

      const part = Number(value) / totalSupplyToNumber;

      const amout0 = parseFloat((reserves0ToNumber * part).toFixed(10)).toString();
      const amout1 = parseFloat((reserves1ToNumber * part).toFixed(10)).toString();

      setAmountInValue(amout0);
      setAmountOutValue(amout1);
    }
  };

  const handleAmountInChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = onlyNumbers(e.target.value);
    let valueOut: any;
    setAmountInValue(value);

    if (Number(value)) {
      const price = await getAmountsOut({ amount: value });
      valueOut = price?.amountOut;
    }

    const formatAmountOutValue = valueOut
      ? parseFloat(Number(ethers.utils.formatEther(valueOut)).toFixed(10)).toString()
      : isWrapPair
      ? value
      : "";
    setAmountOutValue(formatAmountOutValue);
  };

  const handleAmountOutChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = onlyNumbers(e.target.value);
    let valueOut: any;
    setAmountOutValue(value);

    if (Number(value)) {
      const price = await getAmountsOut({ amount: value });
      valueOut = price?.amountOut;
    }

    const formatAmountInValue = valueOut
      ? parseFloat(Number(ethers.utils.formatEther(valueOut)).toFixed(10)).toString()
      : isWrapPair
      ? value
      : "";
    setAmountInValue(formatAmountInValue);
  };

  return {
    amountInValue,
    amountOutValue,
    amountInLPValue,
    handleAmountInChange,
    handleAmountOutChange,
    handleAmountInLPChange,
    setAmountInValue,
    setAmountOutValue,
    setAmountInLPValue,
  };
};

import React, { useEffect, useState } from "react";
import { Button } from "../Button";
import { ReactComponent as Arrow } from "../../assets/images/arrow.svg";
import { ExchangeItem } from "./ExchangeItem/ExchangeItem";
import useSmartContractContext from "../../hooks/useSmartContractContext";
import { ethers } from "ethers";
import { Tokens } from "../../types/tokens";
import { onlyNumbers, removeDot } from "../../utils/onlyNumbers";
import { notify } from "../../utils/notify";

export const Exchange = () => {
  const [loading, setLoading] = useState(false);
  const { contract, provider, currentAccount } = useSmartContractContext();
  const [exchangeConfig, setExchangeDefaultConfig] = useState({
    from: Tokens.ETH,
    to: Tokens.WETH,
    ethToWethCoeff: 1,
  });
  const [tokens, setTokens] = useState({
    ETH: { label: Tokens.ETH, balance: ethers.BigNumber.from(0) },
    WETH: { label: Tokens.WETH, balance: ethers.BigNumber.from(0) },
  });

  const [inputValue, setInputValue] = useState({
    from: "",
    to: "",
  });

  const isEnoughBalance =
    ethers.utils.parseUnits(inputValue.from || "0", "ether") > tokens[exchangeConfig.from]?.balance;

  const getBalance = async () => {
    if (currentAccount) {
      const balances = (await Promise.all([
        provider?.getBalance(currentAccount),
        contract?.balanceOf(currentAccount),
      ])) as ethers.BigNumber[];

      setTokens({
        ...tokens,
        ETH: { ...tokens.ETH, balance: balances[0] },
        WETH: { ...tokens.WETH, balance: balances[1] },
      });
    }
  };

  useEffect(() => {
    getBalance();
  }, [contract]);

  const sendTransaction = async (amount: string) => {
    try {
      let tx: any;
      setLoading(true);
      if (exchangeConfig.from === Tokens.ETH)
        tx = await contract?.deposit({ value: ethers.utils.parseEther(amount) });
      if (exchangeConfig.from === Tokens.WETH)
        tx = await contract?.withdraw(ethers.utils.parseEther(amount));
      await tx.wait();
      await getBalance();
      setInputValue({ from: "", to: "" });
    } catch (error) {
      notify({ type: "error", message: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    sendTransaction(inputValue.from);
  };

  const configRevers = () => {
    setExchangeDefaultConfig({
      ...exchangeConfig,
      from: exchangeConfig.to,
      to: exchangeConfig.from,
    });
  };

  const handleFromInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = onlyNumbers(e.target.value);

    setInputValue({
      ...inputValue,
      from: value,
      to: value.length ? (Number(value) * exchangeConfig.ethToWethCoeff).toString() : "",
    });
  };

  const handleToInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = onlyNumbers(e.target.value);

    setInputValue({
      ...inputValue,
      to: value,
      from: value.length ? (+value * exchangeConfig.ethToWethCoeff).toString() : "",
    });
  };

  return (
    <div className="w-full rounded-2xl px-1 py-2 border border-slate-400 bg-white">
      <div className="my-2 px-2 font-medium">Exchange</div>
      <form onSubmit={handleFormSubmit}>
        <ExchangeItem
          handleInputChange={handleFromInputChange}
          inputValue={inputValue.from}
          balance={tokens[exchangeConfig.from].balance}
          label={tokens[exchangeConfig.from].label}
          handleInputBlur={() => {
            setInputValue({ ...inputValue, from: removeDot(inputValue.from) });
          }}
        />
        <div
          onClick={configRevers}
          className="flex justify-center items-center h-10 w-10 rounded-xl border-4 border-white bg-violet-100 mx-auto -mt-4 -mb-4 cursor-pointer relative"
        >
          <Arrow />
        </div>
        <ExchangeItem
          handleInputChange={handleToInputChange}
          inputValue={inputValue.to}
          balance={tokens[exchangeConfig.to].balance}
          label={tokens[exchangeConfig.to].label}
          handleInputBlur={() => {
            setInputValue({ ...inputValue, to: removeDot(inputValue.to) });
          }}
        />
        <div className="my-4">
          <Button
            disabled={Number(inputValue.from) === 0 || loading || isEnoughBalance}
            className="h-12"
          >
            {loading ? "Loading..." : isEnoughBalance ? "Balance is not enough" : "Swap"}
          </Button>
        </div>
      </form>
    </div>
  );
};

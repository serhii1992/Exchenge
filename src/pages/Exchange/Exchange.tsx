import React, { useEffect, useState, FC } from "react";
import { Button } from "../../components/Button";
import { ExchangeTextField } from "../../components/ExchangeTextField";
import useWalletContext from "../../hooks/useWalletContext";
import { BigNumber, ethers } from "ethers";
import { ETHAdress, IPair, IToken } from "../../types/tokens";
import { onlyNumbers, removeDot } from "../../utils/onlyNumbers";
import { Modal } from "../../components/Modal";
import { TokenSelection } from "../../components/TokenSelection.tsx/TokenSelection";
import useModalContext from "../../hooks/useModalContext";
import { modalType } from "../../context/modalContext";
import { useSwap } from "./hooks/useSwap";
import { ExchangeHeader } from "./ExchangeHeader/ExchangeHeader";
import { useCheckPairExist } from "./hooks/useCheckPairExist";
import erc20ABI from "../../contracts/abis/erc20.json";
import { useExchangeInput } from "./hooks/useExchangeInput";
import useTokensContext from "../../hooks/useTokensContext";
import { checkAddress } from "../../utils/checkAddress";
import { Pair } from "../../components/Pair";

export const Exchange = () => {
  const { pair, setPair } = useWalletContext();
  const [slippage, setSlippage] = useState("100");
  const { type, setModal } = useModalContext();
  const { shortTokenList, tokensList, setTokensList, searchTokensByAdress } = useTokensContext();
  const { isPairExist, isWrapPair } = useCheckPairExist();
  const { swapTokens, loading } = useSwap();
  const [inputSearchValue, setInputSearchValue] = useState("");
  const inputs = useExchangeInput();

  const isEnoughBalance = pair?.token0?.balance?.lt(
    ethers.utils.parseUnits(inputs.amountInValue || "0", 18)
  );

  const filteredTokens = tokensList.filter(
    (token) =>
      token.name.toLocaleLowerCase().includes((inputSearchValue || "").toLocaleLowerCase()) ||
      token.address.toLocaleLowerCase().includes((inputSearchValue || "").toLocaleLowerCase())
  );

  const handleSearchToken = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInputSearchValue(value);

    if (checkAddress(value || "")) {
      const targetToken = await searchTokensByAdress(value || "");
      const result = tokensList.find((token) => token.address === targetToken?.address);
      if (!result) setTokensList((prev) => [...prev, targetToken as IToken]);
    }
  };

  const handleClickToken = (token: IToken) => {
    if (type === modalType.AMOUNT_IN && pair && setPair) {
      const tempPair = { ...pair, token0: token };
      setPair(tempPair);
    }
    if (type === modalType.AMOUNT_OUT && pair && setPair) {
      const tempPair = { ...pair, token1: token };
      setPair(tempPair);
    }
    setInputSearchValue("");
    setModal({ type: null });
  };

  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (pair.token0 && pair.token1) {
      swapTokens({ amount: inputs.amountInValue, slippage });
      inputs.setAmountInValue("");
      inputs.setAmountOutValue("");
    }
  };

  return (
    <div className="max-w-md grow pt-16 px-2 flex justify-center mx-auto">
      <div className="w-full rounded-2xl px-1 py-2 border border-slate-400 bg-white">
        {loading && (
          <div className="text-center text-blue-600 font-semibold">Processing transaction...</div>
        )}
        <ExchangeHeader
          handleSlippageChange={(value) => {
            setSlippage(value);
          }}
          slippage={slippage}
        />
        <form onSubmit={handleFormSubmit}>
          <Pair
            inputIn={{
              value: inputs.amountInValue,
              handleChange: inputs.handleAmountInChange,
              label: pair.token0?.symbol,
              balance: pair.token0?.balance,
              handleBlur(event) {
                inputs.setAmountInValue(removeDot(inputs.amountInValue));
              },
            }}
            inputOut={{
              value: inputs.amountOutValue,
              handleChange: inputs.handleAmountOutChange,
              label: pair.token1?.symbol,
              balance: pair.token1?.balance,
              handleBlur(event) {
                inputs.setAmountOutValue(removeDot(inputs.amountOutValue));
              },
            }}
          />
          <div className="my-4">
            <Button
              type="submit"
              disabled={
                Number(inputs.amountInValue) === 0 || loading || isEnoughBalance || !isPairExist
              }
              className="h-12 text-white"
            >
              {isEnoughBalance
                ? "Balance is not enough"
                : !isPairExist
                ? "Pair does not exist"
                : "Swap"}
            </Button>
          </div>
        </form>
        <Modal
          active={!!type}
          handleClickModal={() => {
            setModal({ type: null });
            setInputSearchValue("");
          }}
        >
          <TokenSelection
            shortTokenList={shortTokenList}
            longTokenList={filteredTokens}
            value={inputSearchValue}
            onChange={handleSearchToken}
            handleClickToken={handleClickToken}
            handleClose={() => {
              setModal({ type: null });
            }}
          />
        </Modal>
      </div>
    </div>
  );
};

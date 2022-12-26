import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { Button } from "../../components/Button";
import { ExchangeTextField } from "../../components/ExchangeTextField";
import { Modal } from "../../components/Modal";
import { Pair } from "../../components/Pair";
import { TokenSelection } from "../../components/TokenSelection.tsx/TokenSelection";
import { modalType } from "../../context/modalContext";
import useModalContext from "../../hooks/useModalContext";
import useTokensContext from "../../hooks/useTokensContext";
import useWalletContext from "../../hooks/useWalletContext";
import { IToken } from "../../types/tokens";
import { checkAddress } from "../../utils/checkAddress";
import { onlyNumbers, removeDot } from "../../utils/onlyNumbers";
import LPTokenABI from "../../contracts/abis/lpTokens.json";
import { commonContracts } from "../../contracts/addresses";
import router02ContractABI from "../../contracts/abis/router02.json";
import erc20ABI from "../../contracts/abis/erc20.json";
import { useExchangeInput } from "../Exchange/hooks/useExchangeInput";
import lpABI from "../../contracts/abis/lpTokens.json";

export const Pool = () => {
  const { setModal, type } = useModalContext();
  const inputs = useExchangeInput();
  const { signer, ETH, pair, setPair, LPToken, setLPToken } = useWalletContext();
  const [inputSearchValue, setInputSearchValue] = useState("");
  const {
    shortTokenList,
    tokensList,
    setTokensList,
    searchTokensByAdress,
    LPTokensList,
    shortLPTokenList,
    fetchDataTokens,
  } = useTokensContext();

  const routerContract =
    signer && new ethers.Contract(commonContracts.router02, router02ContractABI, signer);

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

  const getPairOfLPTOken = async (
    LPToken: IToken
  ): Promise<{ address0: string; address1: string }> => {
    try {
      const contract = signer && new ethers.Contract(LPToken.address, LPTokenABI, signer);
      const [address0, address1] = await Promise.all([contract?.token0(), contract?.token1()]);
      return { address0, address1 };
    } catch (error) {
      console.log(error);
    }
    return { address0: "", address1: "" };
  };

  const buyForPair = async () => {
    const appruvalAmount = ethers.utils.parseUnits("1000", 18).toString();
    if (LPToken && signer) {
      const { address0, address1 } = LPToken && (await getPairOfLPTOken(LPToken));

      const contract0 = new ethers.Contract(address0, erc20ABI, signer);
      const contract1 = new ethers.Contract(commonContracts.WETH, erc20ABI, signer);

      await Promise.all([
        contract0.approve(commonContracts.router02, appruvalAmount),
        contract1.approve(commonContracts.router02, appruvalAmount),
      ]);

      // const amountAMin = 0;
      // const amountBMin = 0;
      // const amountADesired = amountOut;
      // const amountBDesired = ethers.utils.parseUnits("0.001", "ether")
      // const dateTime = Math.floor(Date.now() / 1000 + 60 * 20); // 20 min
    }
  };

  const handleClickToken = async (token: IToken) => {
    if (type === modalType.AMOUNT_IN) {
      const tempPair = { ...pair, token0: token };
      setPair(tempPair);
    }
    if (type === modalType.AMOUNT_OUT) {
      const tempPair = { ...pair, token1: token };
      setPair(tempPair);
    }
    if (type === modalType.AMOUNT_IN_LP && signer) {
      const { address0, address1 } = await getPairOfLPTOken(token);
      const newPair = await fetchDataTokens([address0, address1]);
      setPair({ token0: newPair[0], token1: newPair[1] });
      setLPToken(token);
    }

    setInputSearchValue("");
    setModal({ type: null });
  };

  return (
    <div className="max-w-md pt-8 px-2 flex justify-center mx-auto">
      <div className="border border-slate-300 rounded-xl px-3 w-full">
        <div className="border-b border-slate-400 text-center font-medium w-full py-3">
          Buy LP TOKEN
        </div>
        <div className="py-2">
          <div className="mb-3">
            <ExchangeTextField
              handleInputChange={inputs.handleAmountInLPChange}
              defaultLabel={"Select LP token"}
              balance={LPToken?.balance}
              label={LPToken?.symbol}
              inputValue={inputs.amountInLPValue}
              handleInputBlur={() => {
                inputs.setAmountInLPValue(removeDot(inputs.amountInLPValue));
              }}
              onClick={() => {
                setModal({ type: modalType.AMOUNT_IN_LP });
              }}
            />
          </div>
          <div>
            <Pair
              inputIn={{
                value: inputs.amountInValue,
                handleChange: inputs.handleAmountInChange,
                handleBlur(event) {
                  inputs.setAmountInValue(removeDot(inputs.amountInValue));
                },
                label: pair.token0?.symbol,
                balance: pair.token0?.balance,
              }}
              inputOut={{
                value: inputs.amountOutValue,
                handleChange: inputs.handleAmountOutChange,
                handleBlur(event) {
                  inputs.setAmountOutValue(removeDot(inputs.amountOutValue));
                  console.log("gdsgdsf");
                },
                label: pair.token1?.symbol,
                balance: pair.token1?.balance,
              }}
            />
            <div className="flex gap-4 mt-2">
              <Button
                className="h-10"
                onClick={() => {
                  //@ts-ignore
                  buyForPair();
                }}
              >
                Buy for pair tokens
              </Button>
              <Button className="h-10">Buy for ETH</Button>
            </div>
          </div>
        </div>
      </div>
      <Modal
        active={!!type}
        handleClickModal={() => {
          setModal({ type: null });
          setInputSearchValue("");
        }}
      >
        <TokenSelection
          shortTokenList={type === modalType.AMOUNT_IN_LP ? shortLPTokenList : shortTokenList}
          longTokenList={type === modalType.AMOUNT_IN_LP ? LPTokensList : filteredTokens}
          value={inputSearchValue}
          onChange={handleSearchToken}
          handleClickToken={handleClickToken}
          pair={pair}
          LPToken={LPToken}
          handleClose={() => {
            setModal({ type: null });
          }}
        />
      </Modal>
    </div>
  );
};

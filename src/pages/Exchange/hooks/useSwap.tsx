import React, { useState } from "react";
import { BigNumber, ethers, providers } from "ethers";
import { commonContracts } from "../../../contracts/addresses";
import useWalletContext from "../../../hooks/useWalletContext";
import router02ContractABI from "../../../contracts/abis/router02.json";
import wethABI from "../../../contracts/abis/WETH.json";
import erc20ABI from "../../../contracts/abis/erc20.json";
import { ETHAdress, IPair } from "../../../types/tokens";
import { useCheckPairExist } from "./useCheckPairExist";
import { notify } from "../../../utils/notify";

type SwapTokens = { amount: string; slippage: string };

export const useSwap = () => {
  const { currentAccount, signer, provider, pair, setPair } = useWalletContext();
  const { isWrapPair } = useCheckPairExist();
  const [loading, setLoading] = useState(false);
  const routerContract =
    signer && new ethers.Contract(commonContracts.router02, router02ContractABI, signer);

  const getAmountsOut = async ({ amount }: { amount: string }) => {
    try {
      let address0 = pair.token0?.address;
      let address1 = pair.token1?.address;
      const addressETH = ETHAdress.adress;

      if (!isWrapPair && address0 && address1 && address0 !== address1) {
        address0 = address0 === addressETH ? commonContracts.WETH : address0;
        address1 = address1 === addressETH ? commonContracts.WETH : address1;

        const [amountIn, amountOut] = await routerContract?.getAmountsOut(
          ethers.utils?.parseUnits(amount, 18),
          [address0, address1]
        );
        return { amountIn, amountOut };
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateTokenBalance = async (
    address: string | ETHAdress.adress,
    target: "token0" | "token1"
  ) => {
    if(currentAccount && setPair){
      if (address !== ETHAdress.adress) {
        const contract = signer && new ethers.Contract(address, erc20ABI, signer);
        const balance = await contract?.balanceOf(currentAccount);
        setPair((old)=>({ ...old, [target]: { ...old[target], balance } }) as IPair);
      } else {
        const balance =  await provider?.getBalance(currentAccount);
        setPair((old)=>({ ...old, [target]: { ...old[target], balance } }) as IPair);
      }
    }

  };

  const updatePair = () => {
    if (pair.token0 && pair.token1) {
      const address0 = pair.token0?.address;
      const address1 = pair.token1?.address;
      updateTokenBalance(address0, "token0");
      updateTokenBalance(address1, "token1");
    }
  };

  const swapTokens = async ({ amount, slippage }: SwapTokens) => {
    if (currentAccount && signer && routerContract && pair.token0 && pair.token1) {
      try {
        setLoading(true);
        let tx: any;

        const appruvalAmount = ethers.utils.parseUnits("1000", 18).toString();
        const address0 = pair.token0?.address;
        const address1 = pair.token1?.address;
        const WETH = await routerContract.WETH();

        const price = await getAmountsOut({ amount });

        const amountOut = Number(ethers.utils.formatEther(price?.amountOut || "0"));
        const amountOutMin = amountOut - (amountOut * (+slippage / 100));
        const dateTime = Math.floor(Date.now() / 1000 + 60 * 20); // 20 min

        // ETH => TOKENS
        if (address0 === ETHAdress.adress && address1 !== WETH) {
          const contract1 = new ethers.Contract(address1, erc20ABI, signer);
          const contractWETH = new ethers.Contract(WETH, erc20ABI, signer);

          await Promise.all([
            contract1.approve(commonContracts.router02, appruvalAmount),
            contractWETH.approve(commonContracts.router02, appruvalAmount),
          ]);

          tx = await routerContract?.swapExactETHForTokens(
            ethers.utils.parseUnits(amountOutMin.toString(), "ether"),
            [WETH, address1],
            currentAccount,
            dateTime,
            {
              value: ethers.utils.parseUnits(amount),
            }
          );
          await tx.wait();
          updatePair();
          setLoading(false);
        }
        // TOKENS => ETH
        if (address1 === ETHAdress.adress && address0 !== WETH) {
          const contract0 = new ethers.Contract(address0, erc20ABI, signer);
          const contractWETH = new ethers.Contract(WETH, erc20ABI, signer);

          await Promise.all([
            contract0.approve(commonContracts.router02, appruvalAmount),
            contractWETH.approve(commonContracts.router02, appruvalAmount),
          ]);
          tx = await routerContract?.swapExactTokensForETH(
            ethers.utils.parseUnits(amount),
            ethers.utils.parseUnits(amountOutMin.toString(), "ether"),
            [address0, WETH],
            currentAccount,
            dateTime,
            {
              gasLimit: 500000,
            }
          );
          await tx.wait();
          updatePair();
        }

        // TOKENS => TOKENS

        if (address0 !== ETHAdress.adress && address1 !== ETHAdress.adress) {
          const contract0 = new ethers.Contract(address0, erc20ABI, signer);
          const contract1 = new ethers.Contract(address1, erc20ABI, signer);
          console.log(ethers.utils.parseUnits(amount, 18).toString());
          
          await Promise.all([
            contract0.approve(commonContracts.router02, appruvalAmount),
            contract1.approve(commonContracts.router02, appruvalAmount),
          ]);
          tx = await routerContract?.swapExactTokensForTokens(
            ethers.utils.parseUnits(amount),
            ethers.utils.parseUnits(amountOutMin.toString(), "ether"),
            [address0, address1],
            currentAccount,
            dateTime,
            {
              gasLimit: 500000,
            }
          );
          await tx.wait();
          updatePair();
        }

        //WRAP ETH
        if (isWrapPair) {
          const contract = new ethers.Contract(WETH, wethABI, signer);
          if (address0 === ETHAdress.adress)
            tx = await contract?.deposit({ value: ethers.utils.parseEther(amount) });
          if (address0 === WETH) tx = await contract?.withdraw(ethers.utils.parseEther(amount));
          await tx.wait();
          updatePair();
        }
      } catch (error) {
        console.log(error);
        notify({ type: "error", message: (error as Error).message });
      } finally {
        setLoading(false);
      }
    }
  };

  return { swapTokens, getAmountsOut, loading };
};

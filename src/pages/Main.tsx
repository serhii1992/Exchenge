import useSmartContractContext from "../hooks/useWalletContext";

import factoryContractABI from "../contracts/abis/factory.json";
import lpTokensABI from "../contracts/abis/lpTokens.json";
import { commonContracts } from "../contracts/addresses";
import { ethers } from "ethers";
import { unique } from "../utils/unique";

import router02ContractABI from "../contracts/abis/router02.json";
import erc20ABI from "../contracts/abis/erc20.json";
import { useEffect, useState } from "react";
import useWalletContext from "../hooks/useWalletContext";
import { DEFAULT_LP_TOKENS } from "../constants/tokens";

export const Main = () => {
  const { signer, currentAccount } = useWalletContext();
  const routerContract =
    signer && new ethers.Contract(commonContracts.router02, router02ContractABI, signer);

  const onButtonClick = async () => {
    try {
      if (signer) {
        // const a =   ethers.utils?.parseUnits("2.0001", "ether")
        // console.log(a.toString());

        // let tx: any;

        // const addresses = await Promise.all([contract.token0(), contract.token1()]);

        const DAI = "0x5C221E77624690fff6dd741493D735a17716c26B";
        const [amountIn, amountOut] = await routerContract?.getAmountsOut(
          ethers.utils?.parseUnits("0.001", 18),
          [commonContracts.WETH, DAI]
        );

        const contract = new ethers.Contract(DEFAULT_LP_TOKENS[0], lpTokensABI, signer);
        const totalSuply = await contract.totalSupply();
        const reserves = await contract.getReserves();

        const totalDai = amountOut;
        const totalDaiETH = ethers.utils.formatEther(amountOut.toString());
        const totalDAInumber = +totalDaiETH.toString();

        const reservesETH = ethers.utils.formatEther(reserves[0].toString());
        const reservesNumber = +reservesETH.toString();

        const partNumber = totalDAInumber / reservesNumber;

        const totalSupplyETH = ethers.utils.formatEther(totalSuply.toString());
        const totalSupplyNumber = +totalSupplyETH.toString();

        const result = totalSupplyNumber * partNumber;
        console.log(result);

        const b = reserves[0];
        const part = totalDai.div(b);

        const getTotalLP = totalSuply.mul(part);
        const a = ethers.utils.parseUnits(getTotalLP.toString(), "ether");

        const appruvalAmount = ethers.utils.parseUnits("1000", 18).toString();

        const amountAMin = 0;
        const amountBMin = 0;
        const amountADesired = amountOut;
        const amountBDesired = ethers.utils.parseUnits("0.001", "ether");
        const dateTime = Math.floor(Date.now() / 1000 + 60 * 20); // 20 min

        const contract1 = new ethers.Contract(DAI, erc20ABI, signer);
        const contractWETH = new ethers.Contract(commonContracts.WETH, erc20ABI, signer);

        // await Promise.all([
        //   contract1.approve(commonContracts.router02, appruvalAmount),
        //   contractWETH.approve(commonContracts.router02, appruvalAmount),
        // ]);
        //         const value = ethers.utils.formatUnits("3064382301765486926", "ether")
        // console.log(value);

        //0.2473642316988462

        // 2.25777
        const tx = await routerContract?.addLiquidity(
          DAI,
          commonContracts.WETH,
          amountADesired.toString(), // uint amountADesired,
          amountBDesired.toString(), // uint amountBDesired,
          amountAMin, // uint amountAMin,
          amountBMin, // uint amountBMin,
          currentAccount, // to
          dateTime,
          {
            gasLimit: 500000,
          }
        );
        await tx.wait();
        console.log(tx);

        // tx = await routerContract?.swapExactETHForTokens(
        //   0,
        //   [commonContracts.WETH, addresses[1]],
        //   currentAccount,
        //   dateTime,
        //   {
        //     value: ethers.utils.parseUnits("0.01"),
        //   }
        // );
        // await tx.wait();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center">{<button onClick={onButtonClick}>BUTTON</button>}</div>
  );
};

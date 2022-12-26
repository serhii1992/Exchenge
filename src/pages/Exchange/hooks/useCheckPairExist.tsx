import { ethers } from "ethers";
import React, { useState, useEffect } from "react";
import { commonContracts } from "../../../contracts/addresses";
import useWalletContext from "../../../hooks/useWalletContext";
import { ETHAdress, IPair } from "../../../types/tokens";
import router02ContractABI from "../../../contracts/abis/router02.json";
import factoryContractABI from "../../../contracts/abis/factory.json";
import { emptyAddress } from "../../../constants/tokens";

export const useCheckPairExist = () => {
  const {pair} = useWalletContext()
  let address0 = pair?.token0?.address;
  let address1 = pair?.token1?.address;
  const addressETH = ETHAdress.adress;

  const { signer } = useWalletContext();
  const [isPairExist, setPairExist] = useState(true);
  const routerContract =
    signer && new ethers.Contract(commonContracts.router02, router02ContractABI, signer);

  const isWrapPair =
    (address0 === addressETH && address1 === commonContracts.WETH) ||
    (address0 === commonContracts.WETH && address1 === addressETH);

  const checkPairExist = async () => {
    if (signer) {
      try {
        if (isWrapPair) {
          setPairExist(true);
        } else {
          address0 = address0 === addressETH ? commonContracts.WETH : address0;
          address1 = address1 === addressETH ? commonContracts.WETH : address1;

          if (address0 && address1) {
            const factory = new ethers.Contract(
              commonContracts.factory,
              factoryContractABI,
              signer
            );
            const addressPair = await factory?.getPair(address0, address1);
            console.log(addressPair);
              
            if (addressPair === emptyAddress) setPairExist(false);
            else setPairExist(true);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    checkPairExist();
  }, [pair]);

  return { isPairExist, isWrapPair };
};

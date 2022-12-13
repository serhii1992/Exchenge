import React, { ReactNode, useState, useEffect } from "react";
import { ethers } from "ethers";
import { Nullable } from "../types/nullable";
import { contractConstants } from "../constants/contract";
import ABI from "../abi/contractAbi.json";
import { notify } from "../utils/notify";

interface IInitialState {
  contract: Nullable<ethers.Contract>;
  signer: Nullable<ethers.providers.JsonRpcSigner>;
  provider: Nullable<ethers.providers.Web3Provider>;
  currentAccount: Nullable<string>;
  connectWalletHandler: VoidFunction;
}

const initialState = {
  contract: null,
  signer: null,
  provider: null,
  currentAccount: null,
  connectWalletHandler: () => {},
};

export const SmartContractContext = React.createContext<IInitialState>(initialState);

const SmartContractContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [provider, setProvider] = useState<Nullable<ethers.providers.Web3Provider>>(null);
  const [signer, setSigner] = useState<Nullable<ethers.providers.JsonRpcSigner>>(null);
  const [contract, setContract] = useState<Nullable<ethers.Contract>>(null);

  const connectWalletHandler = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" }, []);

        accountChangedHandler(accounts);
        notify({ type: "success", message: "Wallet Connected" });
      } catch (error) {
        notify({ type: "error", message: (error as Error).message });
      }
    } else {
      console.log("Need to install MetaMask");
      notify({ type: "error", message: "Please install MetaMask browser extension to interact" });
    }
  };

  useEffect(() => {
    connectWalletHandler();
    window.ethereum.on("accountsChanged", accountChangedHandler);
    window.ethereum.on("chainChanged", updateEthers);

    return () => {
      window.ethereum.removeListener('accountsChanged', accountChangedHandler)
      window.ethereum.removeListener('chainChanged', updateEthers)
    };
  }, []);

  const updateEthers = async () => {
    const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(tempProvider);

    const tempSigner = tempProvider.getSigner();
    setSigner(tempSigner);

    const tempContract = new ethers.Contract(contractConstants.address, ABI, tempSigner);
    setContract(tempContract);
  };

  const accountChangedHandler = (newAccounts: string[]) => {
    setCurrentAccount(newAccounts[0]);
    updateEthers();
  };
  
  return (
    <SmartContractContext.Provider
      value={{
        provider,
        signer,
        contract,
        currentAccount,
        connectWalletHandler,
      }}
    >
      {children}
    </SmartContractContext.Provider>
  );
};

export default SmartContractContextProvider;

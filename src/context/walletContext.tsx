import React, { ReactNode, useState, useEffect } from "react";
import { BigNumber, ethers } from "ethers";
import { Nullable } from "../types/nullable";
import { notify } from "../utils/notify";
import { ETHAdress, IPair, IToken } from "../types/tokens";
import erc20ABI from "../contracts/abis/erc20.json";
import { emptyAddress } from "../constants/tokens";

interface IInitialState {
  signer: Nullable<ethers.providers.JsonRpcSigner>;
  provider: Nullable<ethers.providers.Web3Provider>;
  currentAccount: Nullable<string>;
  pair: IPair;
  LPToken: IToken | null;
  ETH: IToken;
  connectWalletHandler: VoidFunction;
  setPair: React.Dispatch<React.SetStateAction<IPair>>;
  setLPToken: React.Dispatch<React.SetStateAction<IToken | null>>
}

const initialState = {
  signer: null,
  provider: null,
  currentAccount: null,
  pair: { token0: null, token1: null },
  LPToken: null,
  ETH: {address: ETHAdress.adress, name: "Ether", symbol: "ETH"},
  connectWalletHandler: () => {},
  setPair: () => {},
  setLPToken: () => {},
};

export const WalletContext = React.createContext<IInitialState>(initialState);

const WalletContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [provider, setProvider] = useState<Nullable<ethers.providers.Web3Provider>>(null);
  const [signer, setSigner] = useState<Nullable<ethers.providers.JsonRpcSigner>>(null);
  const [pair, setPair] = useState<IPair>({ token0: null, token1: null });
  const [LPToken, setLPToken] = useState<IToken | null>(null);
  const [ETH, setETH] = useState<IToken>({
    address: ETHAdress.adress,
    name: "Ether",
    symbol: "ETH",
  });

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

  const getETHData = async () => {
    const balance = await provider?.getBalance(currentAccount);
    const tempETH = { ...ETH, balance }
    setETH(tempETH);
    setPair({...pair, token0: tempETH})
  };

  useEffect(() => {
    if (provider) {
      getETHData();
    }
    getETHData();
  }, [provider]);

  useEffect(() => {
    connectWalletHandler();
    window.ethereum.on("accountsChanged", accountChangedHandler);
    window.ethereum.on("chainChanged", updateEthers);

    return () => {
      window.ethereum.removeListener("accountsChanged", accountChangedHandler);
      window.ethereum.removeListener("chainChanged", updateEthers);
    };
  }, []);

  const updateEthers = async () => {
    const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(tempProvider);

    const tempSigner = tempProvider.getSigner();
    setSigner(tempSigner);
  };

  const accountChangedHandler = (newAccounts: string[]) => {
    setCurrentAccount(newAccounts[0]);
    updateEthers();
  };

  return (
    <WalletContext.Provider
      value={{
        provider,
        signer,
        currentAccount,
        pair,
        LPToken,
        ETH,
        setLPToken,
        setPair,
        connectWalletHandler,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletContextProvider;

import React, { ReactNode, useState, useEffect } from "react";
import { BigNumber, ethers } from "ethers";
import { Nullable } from "../types/nullable";
import { notify } from "../utils/notify";
import { ETHAdress, IPair, IToken } from "../types/tokens";
import lpABI from "../contracts/abis/lpTokens.json";
import { DEFAULT_LP_TOKENS, DEFAULT_TOKENS, emptyAddress } from "../constants/tokens";
import useWalletContext from "../hooks/useWalletContext";
import { commonContracts } from "../contracts/addresses";
import factoryContractABI from "../contracts/abis/factory.json";
import { unique } from "../utils/unique";

interface IInitialState {
  tokensList: IToken[];
  shortTokenList: IToken[];
  setTokensList: React.Dispatch<React.SetStateAction<IToken[]>>;
  setShortTokenList: React.Dispatch<React.SetStateAction<IToken[]>>;
  searchTokensByAdress: any;
  //searchTokensByAdress: (address: string) => Promise<IToken>;
  LPTokensList: IToken[];
  shortLPTokenList: IToken[];
  fetchDataTokens: any;
}

const initialState = {
  tokensList: [],
  shortTokenList: [],
  LPTokensList: [],
  shortLPTokenList: [],
  setTokensList: () => {},
  setShortTokenList: () => {},
  searchTokensByAdress: (address: string) => Promise<IToken>,
  fetchDataTokens: () => {},
};

export const TokensContext = React.createContext<IInitialState>(initialState);

const TokensContextProvider = ({ children }: { children: ReactNode }) => {
  const { signer, currentAccount, provider } = useWalletContext();
  const [defaultTokenAddressList, setAddressList] = useState(DEFAULT_TOKENS);
  const [defaultLPAddressList, setDefaultLPAddressList] = useState(DEFAULT_LP_TOKENS);
  const [tokensList, setTokensList] = useState<IToken[]>([]);
  const [shortTokenList, setShortTokenList] = useState<IToken[]>([]);
  const [LPTokensList, setLPTokensList] = useState<IToken[]>([]);
  const [shortLPTokenList, setShortLPTokenList] = useState<IToken[]>([]);

  const factoryContract =
    signer && new ethers.Contract(commonContracts.factory, factoryContractABI, signer);

  const getAddresses = async () => {
    try {
      const filter = factoryContract?.filters.PairCreated();
      if (filter && signer) {
        const data = await factoryContract?.queryFilter(filter, 2669131, 2924873);
        const lpTokenAddresses = data?.map((el) => el.args?.["pair"]);
        const tokenAddresses = unique(
          (data?.map((el) => [el.args?.["token0"], el.args?.["token1"]]) || []).flat()
        );
        return { lpTokenAddresses, tokenAddresses };
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataTokens = async (addresses: string[], target?: "LP") => {
    if (signer && addresses.length && currentAccount) {
      const tempTokens: IToken[] = [];
      for (let index = 0; index < addresses.length; index++) {
        try {
          if (addresses[index] === ETHAdress.adress) {
            const balance = await provider?.getBalance(currentAccount);
            const ETH = { name: "ETH", symbol: "Ether", address: addresses[index], balance };
            tempTokens.push(ETH);
          } else {
            const contract = new ethers.Contract(addresses[index], lpABI, signer);
            const [name, symbol, totalSupply, balance, reserves] = await Promise.all([
              contract?.name(),
              contract?.symbol(),
              contract?.totalSupply(),
              contract?.balanceOf(currentAccount),
              target === "LP" ? contract?.getReserves() : null,
            ]);

            const token = {
              name,
              symbol,
              balance,
              totalSupply,
              address: addresses[index],
              reserves,
            };
            tempTokens.push(token);
          }
        } catch (error) {
          console.log(error);
        }
      }
      
      return tempTokens;
    }
  };

  const searchTokensByAdress = async (address: string): Promise<IToken> => {
    if (signer && address) {
      try {
        const contract = new ethers.Contract(address, lpABI, signer);
        const data = await Promise.all([
          contract?.name(),
          contract?.symbol(),
          contract?.balanceOf(currentAccount),
        ]);
        const [name, symbol, balance] = data;
        const tempToken = { name, symbol, address, balance };

        return tempToken;
      } catch (error) {
        console.log(error);
      }
    }
    return {} as IToken;
  };

  useEffect(() => {
    const fetchData = async () => {
      const addreses = await getAddresses();

      const [shortTokenList, tokensList, shortLPTokenList, LPTokensList] = await Promise.all([
        fetchDataTokens(defaultTokenAddressList),
        fetchDataTokens(addreses?.tokenAddresses || [""]),
        fetchDataTokens(defaultLPAddressList, "LP"),
        fetchDataTokens(addreses?.lpTokenAddresses || [""], "LP"),
      ]);

      setShortTokenList(shortTokenList || []);
      setTokensList(tokensList || []);
      setShortLPTokenList(shortLPTokenList || []);
      setLPTokensList(LPTokensList || []);
    };
    fetchData();
  }, [signer]);

  return (
    <TokensContext.Provider
      value={{
        tokensList,
        shortTokenList,
        LPTokensList,
        shortLPTokenList,
        setTokensList,
        setShortTokenList,
        searchTokensByAdress,
        fetchDataTokens,
      }}
    >
      {children}
    </TokensContext.Provider>
  );
};

export default TokensContextProvider;

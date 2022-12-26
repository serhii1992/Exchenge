import { BigNumber } from "ethers";

export enum ETHAdress 
{adress =  "NATIVE"}

export interface IToken {
  address: string | ETHAdress;
  symbol: string;
  name: string;
  balance?: BigNumber;
  totalSupply?: BigNumber;
  reserves?: any;
}

export interface IPair {
  token0: IToken | null;
  token1: IToken | null;
}

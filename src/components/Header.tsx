import React from "react";
import { Link } from "react-router-dom";
import useSmartContractContext from "../hooks/useWalletContext";
import { toShortStr } from "../utils/toShortStr";
import { Button } from "./Button";

export const Header = () => {
  const { currentAccount } = useSmartContractContext();

  return (
    <div className="h-12 bg-fuchsia-100 flex items-center justify-between">
      <div className="container px-3 mx-auto flex items-center justify-between  text-slate-500 text-lg font-semibold ">
        <div className="flex gap-12">
          <Link className="uppercase" to="/">
            exchange
          </Link>
          <div className="text-base text-slate-600 font-normal">
            <Link to="/pool"> Add Liquidity</Link>
          </div>
        </div>
        <div>
          <Button className="text-white">
            {currentAccount ? toShortStr({ str: currentAccount }) : "Connecting with wallet"}
          </Button>
        </div>
      </div>
    </div>
  );
};

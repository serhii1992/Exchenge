import React from "react";
import useSmartContractContext from "../hooks/useSmartContractContext";
import { toShortStr } from "../utils/toShortStr";
import { Button } from "./Button";

export const Header = () => {
  const { currentAccount } = useSmartContractContext();

  return (
    <div className="h-12 bg-fuchsia-100 flex items-center justify-between">
      <div className="container px-3 mx-auto flex items-center justify-between  text-slate-500 text-lg font-semibold ">
        <p className="uppercase">exchange</p>
        <div>
          <Button>
            {currentAccount ? toShortStr({ str: currentAccount }) : "Connecting with wallet"}
          </Button>
        </div>
      </div>
    </div>
  );
};

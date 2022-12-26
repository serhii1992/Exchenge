import { useContext } from "react";
import {WalletContext} from "../context/walletContext";

const useWalletContext = () => {
  const walletContext = useContext(WalletContext);

  return walletContext;
};

export default useWalletContext;

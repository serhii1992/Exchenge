import { useContext } from "react";
import { TokensContext } from "../context/tokensContext";


const useTokensContext = () => {
  const tokensContext = useContext(TokensContext);

  return tokensContext;
};

export default useTokensContext;

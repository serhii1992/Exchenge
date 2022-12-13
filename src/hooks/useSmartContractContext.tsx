import { useContext } from "react";
import {SmartContractContext} from "../context/smartContractContext";

const useSmartContractContext = () => {
  const smartContractContext = useContext(SmartContractContext);

  return smartContractContext;
};

export default useSmartContractContext;

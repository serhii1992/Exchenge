import { useContext } from "react";
import {ModalContext} from "../context/modalContext";

const useModalContext = () => {
  const modalContext = useContext(ModalContext);

  return modalContext;
};

export default useModalContext;

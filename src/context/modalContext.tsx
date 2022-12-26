import React, { ReactNode, useState } from "react";
import { Nullable } from "../types/nullable";

export enum modalType{
    AMOUNT_IN = "amountIn",
    AMOUNT_OUT = "amountOut",
    AMOUNT_IN_LP = "amountInLP",
}

interface IModalContext {
  type: Nullable<modalType>;
  setModal: ({type}: {type: Nullable<modalType>})=> void
}

export const ModalContext = React.createContext<IModalContext>({
  type: null,
  setModal: () => {}
});

const ModalContextProvider = ({ children }: {children: ReactNode}) => {
const [type, setType] = useState<modalType | null>(null)

const setModal = ({type}: {type:modalType | null}) => {
  setType(type)
}

  return (
    <ModalContext.Provider
      value={{type, setModal}}
    >
      {children}
    </ModalContext.Provider>
  );
};

export default ModalContextProvider;
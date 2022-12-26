import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ModalContextProvider from "./context/modalContext";
import WalletContextProvider from "./context/walletContext";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import TokensContextProvider from "./context/tokensContext";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <ModalContextProvider>
    <WalletContextProvider>
      <TokensContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </TokensContextProvider>
    </WalletContextProvider>
  </ModalContextProvider>
);

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import SmartContractContextProvider from "./context/smartContractContext";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <SmartContractContextProvider>
    <App />
  </SmartContractContextProvider>
);

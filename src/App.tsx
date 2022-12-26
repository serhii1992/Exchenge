import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Header } from "./components/Header";
import { Main } from "./pages/Main";
import { Routes, Route } from "react-router-dom";
import { Exchange } from "./pages/Exchange/Exchange";
import { Pool } from "./pages/Pool/Pool";

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/test" element={<Main />} />
        <Route path="/" element={<Exchange />} />
        <Route path="/pool" element={<Pool />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;

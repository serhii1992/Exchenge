import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Header } from "./components/Header";
import { Main } from "./pages/Main";

function App() {

  return (
    <div>
      <Header />
      <Main />
      <ToastContainer />
    </div>
  );
}

export default App;

import { toast } from "react-toastify";

export const notify = (payload: {type: "error" | "success", message: string})=>{
  toast[payload.type](`${payload.message}!`, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
}

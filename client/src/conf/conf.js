import { Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const apiUrl = String(import.meta.env.VITE_API_URL);
export const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: "light",
    transition: Slide,
};

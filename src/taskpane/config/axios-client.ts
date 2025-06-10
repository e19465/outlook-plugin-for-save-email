import axios from "axios";
import { BACKEND_BASE_URL } from "../dotenv-load";

const axiosClient = axios.create({
  baseURL: BACKEND_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export default axiosClient;

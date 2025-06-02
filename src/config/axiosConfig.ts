import axios from "axios";
import { whatsappBaseUrl } from "./config";

const axiosConfig = axios.create({
  baseURL: whatsappBaseUrl,
});

export default axiosConfig;

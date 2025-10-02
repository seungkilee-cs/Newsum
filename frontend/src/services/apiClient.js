import axios from "axios";
import { apiBaseUrl } from "../constants/config";

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

export default apiClient;

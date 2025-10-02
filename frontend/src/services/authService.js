import apiClient from "./apiClient";
import { authEndpoints } from "../constants/config";

export const registerUser = async (payload) => {
  const response = await apiClient.post(authEndpoints.register, payload);
  return response.data;
};

export const loginUser = async (payload) => {
  const response = await apiClient.post(authEndpoints.login, payload);
  return response.data;
};

export const logoutUser = async () => {
  const response = await apiClient.post(authEndpoints.logout);
  return response.data;
};

import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

const API_URL = `${API_BASE_URL}/admin`;

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("learnhubToken")}`,
  },
});

export const getAdminUsers = async () => {
  const response = await axios.get(`${API_URL}/users`, getAuthConfig());
  return response.data;
};

export const updateAdminUserRole = async (userId, role) => {
  const response = await axios.patch(
    `${API_URL}/users/${userId}/role`,
    { role },
    getAuthConfig()
  );
  return response.data;
};

export const deleteAdminUser = async (userId) => {
  const response = await axios.delete(
    `${API_URL}/users/${userId}`,
    getAuthConfig()
  );
  return response.data;
};

export const getAdminAnalytics = async () => {
  const response = await axios.get(`${API_URL}/analytics`, getAuthConfig());
  return response.data;
};

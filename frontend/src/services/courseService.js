
import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

const API_URL = `${API_BASE_URL}/courses`;

export const getCourses = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getCourseById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

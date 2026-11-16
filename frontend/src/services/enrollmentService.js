
import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

const API_URL = `${API_BASE_URL}/enrollments`;

const getAuthConfig = () => {
  const token = localStorage.getItem("learnhubToken");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const enrollInCourse = async (courseId) => {
  const response = await axios.post(
    API_URL,
    { courseId },
    getAuthConfig()
  );

  return response.data;
};

export const getMyEnrollments = async () => {
  const response = await axios.get(
    `${API_URL}/my-courses`,
    getAuthConfig()
  );

  return response.data;
};

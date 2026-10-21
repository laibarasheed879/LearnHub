
import axios from "axios";

const API_URL = "http://localhost:5000/api/enrollments";

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

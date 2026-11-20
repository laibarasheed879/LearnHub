import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

const API_URL = `${API_BASE_URL}/courses`;

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("learnhubToken")}`,
  },
});

export const getCourseLessons = async (courseId) => {
  const response = await axios.get(
    `${API_URL}/${courseId}/lessons`,
    getAuthConfig()
  );
  return response.data;
};

export const uploadCourseLesson = async (courseId, title, file) => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("file", file);
  const response = await axios.post(
    `${API_URL}/${courseId}/lessons`,
    formData,
    getAuthConfig()
  );
  return response.data;
};

export const downloadCourseLesson = async (courseId, lessonId) => {
  const response = await axios.get(
    `${API_URL}/${courseId}/lessons/${lessonId}/file`,
    { ...getAuthConfig(), responseType: "blob" }
  );
  return response.data;
};

export const deleteCourseLesson = async (courseId, lessonId) => {
  const response = await axios.delete(
    `${API_URL}/${courseId}/lessons/${lessonId}`,
    getAuthConfig()
  );
  return response.data;
};

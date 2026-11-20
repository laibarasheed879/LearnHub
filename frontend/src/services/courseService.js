
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

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("learnhubToken")}`,
  },
});

export const getInstructorCourses = async () => {
  const response = await axios.get(`${API_URL}/my-courses`, getAuthConfig());
  return response.data;
};

export const getInstructorEnrollments = async () => {
  const response = await axios.get(
    `${API_URL}/instructor/enrollments`,
    getAuthConfig()
  );
  return response.data;
};

export const saveInstructorCourse = async (courseData, courseId) => {
  const response = courseId
    ? await axios.put(`${API_URL}/${courseId}`, courseData, getAuthConfig())
    : await axios.post(API_URL, courseData, getAuthConfig());
  return response.data;
};

export const deleteInstructorCourse = async (courseId) => {
  const response = await axios.delete(
    `${API_URL}/${courseId}`,
    getAuthConfig()
  );
  return response.data;
};

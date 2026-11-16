const DEPLOYED_API_BASE_URL = "https://learnhub-backend-flame.vercel.app/api";

export const API_BASE_URL =
  process.env.REACT_APP_API_URL || DEPLOYED_API_BASE_URL;

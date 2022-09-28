import axios from "axios";

const PORT = 8000;

export const axiosJWTHolder = axios.create({
  baseURL: `http://localhost:${PORT}`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

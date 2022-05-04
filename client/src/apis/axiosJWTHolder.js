import axios from "axios";

export const axiosJWTHolder = axios.create({
  baseURL: "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
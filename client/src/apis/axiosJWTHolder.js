import axios from "axios";

export const axiosJWTHolder = axios.create({
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
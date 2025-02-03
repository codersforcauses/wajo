import axios from "axios";

export const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL_BASE;

const baseURL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_BACKEND_URL
    : "http://localhost:8000/api";

const api = axios.create({ baseURL });

export default api;

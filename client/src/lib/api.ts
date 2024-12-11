import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api" // temporarily use port 3000 in dev for mock data
    : process.env.NEXT_PUBLIC_BACKEND_URL;

const api = axios.create({ baseURL });

export default api;

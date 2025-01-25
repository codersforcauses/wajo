import axios from "axios";

export const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL_BASE;

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

const api = axios.create({ baseURL });

export default api;

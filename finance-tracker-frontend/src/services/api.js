import axios from "axios";

const api = axios.create({
  baseURL:
    "https://finance-tracker-wmc9.onrender.com",
});

export default api;
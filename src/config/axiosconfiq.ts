import axios from "axios";

const api = axios.create({
  baseURL: "https://sanfossa-backend.onrender.com/apiauth",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

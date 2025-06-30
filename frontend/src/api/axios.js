import axios from "axios";

const api = axios.create({
  baseURL: "https://file-upload-backend-u40z.onrender.com/api", // thay bằng URL backend của bạn
});

export default api;
import axios from "axios";

export default axios.create({
  baseURL: "https://file-upload-backend-u40z.onrender.com/api",
  withCredentials: true, // nếu backend cần gửi cookie
});
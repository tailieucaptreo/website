import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const UploadPage = () => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  if (user?.role !== "admin") return <p>Bạn không có quyền truy cập trang này.</p>;

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/files/upload", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Tải lên thành công!");
    } catch (err) {
      setMessage("Lỗi khi tải lên.");
    }
  };

  return (
    <div>
      <h2>Upload file</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadPage;
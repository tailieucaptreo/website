import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const FileListPage = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/files", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(res.data);
    };
    fetchFiles();
  }, []);

  const handleDownload = async (id, name) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`/api/files/${id}`, {
      responseType: "blob",
      headers: { Authorization: `Bearer ${token}` },
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", name);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    await axios.delete(`/api/files/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setFiles(files.filter((f) => f.id !== id));
  };

  return (
    <div>
      <h2>Danh sách file</h2>
      <ul>
        {files.map((file) => (
          <li key={file.id}>
            {file.originalName}
            <button onClick={() => handleDownload(file.id, file.originalName)}>Tải xuống</button>
            {user?.role === "admin" && (
              <button onClick={() => handleDelete(file.id)}>Xóa</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileListPage;
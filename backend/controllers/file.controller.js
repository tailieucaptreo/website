const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const uploadFile = async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ message: 'Không có file nào được upload' });

  try {
    const saved = await prisma.file.create({
      data: {
        filename: file.originalname,
        path: file.filename,
        mimetype: file.mimetype,
        size: file.size,
        userId: req.user.userId
      }
    });

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi lưu file' });
  }
};

const getFiles = async (req, res) => {
  try {
    const files = await prisma.file.findMany({
      include: { user: true },
      orderBy: { uploadedAt: 'desc' }
    });
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách file' });
  }
};

const downloadFile = async (req, res) => {
  const filePath = path.join(__dirname, '../uploads', req.params.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File không tồn tại' });
  }
  res.download(filePath);
};

const deleteFile = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const file = await prisma.file.findUnique({ where: { id } });
    if (!file) return res.status(404).json({ message: 'Không tìm thấy file' });

    const filePath = path.join(__dirname, '../uploads', file.path);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await prisma.file.delete({ where: { id } });
    res.json({ message: 'Xóa thành công' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi xóa file' });
  }
};

module.exports = { uploadFile, getFiles, downloadFile, deleteFile };
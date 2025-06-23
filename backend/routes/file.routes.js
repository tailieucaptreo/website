const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadFile, getFiles, downloadFile, deleteFile } = require('../controllers/file.controller');
const verifyToken = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/role.middleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + file.originalname;
    cb(null, unique);
  }
});

const upload = multer({ storage });

router.post('/upload', verifyToken, isAdmin, upload.single('file'), uploadFile);
router.get('/', verifyToken, getFiles);
router.get('/:filename', verifyToken, downloadFile);
router.delete('/:id', verifyToken, isAdmin, deleteFile);

module.exports = router;
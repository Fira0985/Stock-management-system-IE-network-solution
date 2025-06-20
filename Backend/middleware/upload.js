const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uploadDir = 'uploads/';
    const originalName = file.originalname;
    const fullPath = path.join(uploadDir, originalName);

    // Check if file already exists
    fs.access(fullPath, fs.constants.F_OK, (err) => {
      if (err) {
        // File does not exist, use original name
        cb(null, originalName);
      } else {
        // File exists, create a unique name
        const uniqueName = Date.now() + '-' + originalName;
        cb(null, uniqueName);
      }
    });
  }
});

const upload = multer({ storage });

module.exports = upload;

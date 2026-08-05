const multer = require('multer');

const allowedTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    if (!allowedTypes.includes(file.mimetype)) {
      return callback(new Error('Format d’image non autorisé'));
    }

    return callback(null, true);
  },
});

module.exports = upload.single('image');

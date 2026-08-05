const crypto = require('crypto');
const path = require('path');
const sharp = require('sharp');

module.exports = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    const filename = `${Date.now()}-${crypto.randomUUID()}.webp`;
    const destination = path.join(__dirname, '..', 'images', filename);

    await sharp(req.file.buffer)
      .rotate()
      .resize({
        width: 800,
        height: 1200,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toFile(destination);

    req.file.filename = filename;

    return next();
  } catch (error) {
    return res.status(500).json({
      message: 'Impossible d’optimiser l’image',
    });
  }
};

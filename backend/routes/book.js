const express = require('express');

const bookController = require('../controllers/book');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const optimizeImage = require('../middleware/sharp-config');

const router = express.Router();

router.get('/bestrating', bookController.getBestRatedBooks);
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getOneBook);

router.post(
  '/',
  auth,
  multer,
  optimizeImage,
  bookController.createBook,
);

router.put(
  '/:id',
  auth,
  multer,
  optimizeImage,
  bookController.updateBook,
);

router.delete(
  '/:id',
  auth,
  bookController.deleteBook,
);

router.post(
  '/:id/rating',
  auth,
  bookController.rateBook,
);

module.exports = router;

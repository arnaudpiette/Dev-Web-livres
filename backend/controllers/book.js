const fs = require('fs/promises');
const path = require('path');
const Book = require('../models/Book');

const getImagePath = (imageUrl) => {
  const filename = path.basename(new URL(imageUrl).pathname);
  return path.join(__dirname, '..', 'images', filename);
};

const deleteImage = async (imageUrl) => {
  try {
    await fs.unlink(getImagePath(imageUrl));
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
};

const deleteUploadedImage = async (file) => {
  if (file?.filename) {
    await deleteImage(`http://localhost/images/${file.filename}`);
  }
};

exports.createBook = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image requise' });
    }

    const bookObject = JSON.parse(req.body.book);

    const book = new Book({
      title: bookObject.title,
      author: bookObject.author,
      year: Number(bookObject.year),
      genre: bookObject.genre,
      userId: req.auth.userId,
      ratings: [],
      averageRating: 0,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });

    await book.save();

    return res.status(201).json({ message: 'Livre créé' });
  } catch (error) {
    await deleteUploadedImage(req.file).catch(() => {});
    return res.status(400).json({ error });
  }
};

exports.updateBook = async (req, res) => {
  let modificationSaved = false;

  try {
    const bookObject = req.body.book
      ? JSON.parse(req.body.book)
      : req.body;
    const book = await Book.findById(req.params.id);

    if (!book) {
      await deleteUploadedImage(req.file);
      return res.status(404).json({ message: 'Livre introuvable' });
    }

    if (book.userId !== req.auth.userId) {
      await deleteUploadedImage(req.file);
      return res.status(403).json({
        message: 'Vous ne pouvez pas modifier ce livre',
      });
    }

    const updatedBook = {
      title: bookObject.title,
      author: bookObject.author,
      year: Number(bookObject.year),
      genre: bookObject.genre,
    };

    if (req.file) {
      updatedBook.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    }

    await Book.updateOne(
      { _id: req.params.id },
      updatedBook,
      { runValidators: true },
    );
    modificationSaved = true;

    if (req.file) {
      await deleteImage(book.imageUrl);
    }

    return res.status(200).json({ message: 'Livre modifié' });
  } catch (error) {
    if (!modificationSaved) {
      await deleteUploadedImage(req.file).catch(() => {});
    }
    return res.status(400).json({ error });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Livre introuvable' });
    }

    if (book.userId !== req.auth.userId) {
      return res.status(403).json({
        message: 'Suppression non autorisée',
      });
    }

    await deleteImage(book.imageUrl);
    await Book.deleteOne({ _id: req.params.id });

    return res.status(200).json({ message: 'Livre supprimé' });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

exports.rateBook = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const grade = Number(req.body.rating);

    if (!Number.isInteger(grade) || grade < 0 || grade > 5) {
      return res.status(400).json({
        message: 'La note doit être comprise entre 0 et 5',
      });
    }

    const book = await Book.findOneAndUpdate(
      {
        _id: req.params.id,
        'ratings.userId': { $ne: userId },
      },
      [
        {
          $set: {
            ratings: {
              $concatArrays: ['$ratings', [{ userId, grade }]],
            },
            averageRating: {
              $avg: {
                $concatArrays: [
                  {
                    $map: {
                      input: '$ratings',
                      as: 'rating',
                      in: '$$rating.grade',
                    },
                  },
                  [grade],
                ],
              },
            },
          },
        },
      ],
      { new: true },
    );

    if (book) {
      return res.status(200).json(book);
    }

    const bookExists = await Book.exists({ _id: req.params.id });

    if (bookExists) {
      return res.status(400).json({
        message: 'Vous avez déjà noté ce livre',
      });
    }

    return res.status(404).json({ message: 'Livre introuvable' });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

exports.getOneBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Livre introuvable' });
    }

    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

exports.getBestRatedBooks = async (req, res) => {
  try {
    const books = await Book.find()
      .sort({ averageRating: -1 })
      .limit(3);

    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

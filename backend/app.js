const express = require('express');
const cors = require('cors');
const path = require('path');

const userRoutes = require('./routes/user');
const bookRoutes = require('./routes/book');

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  '/images',
  express.static(path.join(__dirname, 'images')),
);

app.use('/api/auth', userRoutes);
app.use('/api/books', bookRoutes);

app.use((error, req, res, next) => {
  if (error?.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      message: 'L\'image est trop volumineuse. La taille maximale est de 5 Mo.',
    });
  }

  if (error?.message === 'Format d’image non autorisé') {
    return res.status(400).json({ message: error.message });
  }

  return next(error);
});

module.exports = app;

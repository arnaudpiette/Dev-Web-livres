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

module.exports = app;

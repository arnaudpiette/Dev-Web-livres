const express = require('express');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization',
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  );
  next();
});

app.post('/api/books', (req, res) => {
  console.log(req.body);
  res.status(201).json({ message: 'Livre créé !' });
});

app.get('/api/books', (req, res) => {
  res.status(200).json([
    {
      _id: '1',
      userId: '1',
      title: 'Milwaukee Mission',
      author: 'Elder Cooper',
      imageUrl: 'https://via.placeholder.com/206x260',
      year: 2021,
      genre: 'Policier',
      ratings: [{ userId: '1', grade: 5 }],
      averageRating: 5,
    },
    {
      _id: '2',
      userId: '2',
      title: 'Book for Esther',
      author: 'Alabaster',
      imageUrl: 'https://via.placeholder.com/206x260',
      year: 2022,
      genre: 'Roman',
      ratings: [{ userId: '2', grade: 4 }],
      averageRating: 4,
    },
  ]);
});

module.exports = app;

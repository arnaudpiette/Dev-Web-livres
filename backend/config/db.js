const mongoose = require('mongoose');

async function connectDatabase() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connexion à MongoDB réussie');
}

module.exports = connectDatabase;

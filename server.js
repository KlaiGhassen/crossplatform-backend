require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/movies_db';

// Création du dossier d'uploads s'il n'existe pas
const uploadsDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Servir les fichiers statiques (accessible via http://localhost:3000/uploads/nom_image.png)
app.use(express.static(path.join(__dirname, 'public')));

// Connexion MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('Connecté à MongoDB avec succès'))
  .catch((err) => console.error('Erreur de connexion MongoDB :', err));

// Routes
app.use('/users', userRoutes);
app.use('/movies', movieRoutes);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
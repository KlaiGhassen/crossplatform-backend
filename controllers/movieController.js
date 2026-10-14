const Movie = require('../models/Movie');

// Tous les films : _id, title, image
exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find().select('_id title image');
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Un film : _id, title, image, description
exports.getOneMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Film introuvable' });
    }
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Créer un film (POST /movies/addmovie)
exports.createMovie = async (req, res) => {
  try {
    const { title, description } = req.body;

    let imageUrl = '';

    // Si un fichier image a été téléversé
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      // Fallback si l'utilisateur envoie directement une URL texte
      imageUrl = req.body.image;
    } else {
      return res.status(400).json({ message: 'Une image est requise pour créer un film.' });
    }

    const newMovie = new Movie({
      title,
      image: imageUrl,
      description
    });

    const savedMovie = await newMovie.save();
    res.status(201).json(savedMovie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
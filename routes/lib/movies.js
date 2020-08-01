const express = require('express');
const router = express.Router();
const MoviesController = require('../../controllers/Movies.controller');

router.post('/search', MoviesController.validations.SearchMovie, MoviesController.actions.searchMovie);

module.exports = router;

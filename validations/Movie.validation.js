const {body} = require('express-validator');

const MovieValidation = {
    SearchMovie: [
        body("term").isString()
    ],
};

module.exports = MovieValidation;

const {validationResult} = require('express-validator');
const MovieValidation = require("../validations/Movie.validation");
const http = require('request-promise');
const Redis = require('../Redis');
const client = Redis.getConnection();
const HttpResponse = require("../Helpers/HttpResponse");
const {promisify} = require("util");
const getAsync = promisify(client.get).bind(client);

const validations = {
    SearchMovie: MovieValidation.SearchMovie
};

const searchMovie = async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) {
        return res.status(401).json({errors: errors, success: false, type: 'validation'});
    }
    let {username, password} = req.headers;

    if (username !== process.env.AUTH_USERNAME || password !== process.env.AUTH_PASSWORD) {
        return res.status(200).send({
            status: HttpResponse.Error,
            message: "Failed to authenticate",
        }).end()
    }

    let year = req.body.year;
    let type = req.body.type;
    let term = encodeURIComponent(req.body.term);
    let result = await getAsync(req.body.term);

    if (result) {
        res.status(200).send({
            status: HttpResponse.Success,
            message: "Movie record found (returned from redis)",
            movie: JSON.parse(result)
        }).end()
    } else {

        http({
            method: 'GET',
            uri: `http://www.omdbapi.com/?apikey=${process.env.API_KEY}&t=${term}&y=${year}&type=${type}`,
            json: true
        })
            .then((response) => {
                client.set(req.body.term, JSON.stringify(response));
                res.status(200).send({
                    status: HttpResponse.Success,
                    message: "Movie record found (stored in redis)",
                    movie: response
                }).end();
            })
            .catch((err) => {
                res.status(400).send({
                    status: HttpResponse.Error,
                    message: "Something went wrong",
                    err
                }).end();
            });
    }
};

module.exports = {validations, actions: {searchMovie}};

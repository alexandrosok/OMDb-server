var express = require('express');
var router = express.Router();

router.use('/movies/', require('./lib/movies'));

module.exports = router;

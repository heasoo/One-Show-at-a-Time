const express = require('express');
const router = express.Router();

var passport = require('../middleware/passport');


router.get('/', function(req, res) {
	if (req.user) {
		res.render('shows.ejs');
	} else {
		res.render('index.ejs');
	}
});

module.exports = router;
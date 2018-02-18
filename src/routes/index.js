const express = require('express');
const router = express.Router();

var passport = require('../middleware/passport');


router.get('/', function(req, res) {
	if (req.user) {
		res.redirect('/shows');
	} else {
		res.render('index.ejs');
	}
});

router.get('/faq', function(req, res, next) {
	res.render('FAQ.ejs');
});

router.get('/aboutUs', function(req, res, next) {
	res.render('aboutUs.ejs');
});

router.get('/contactUs', function(req, res, next) {
	res.render('contactUs.ejs');
});

module.exports = router;
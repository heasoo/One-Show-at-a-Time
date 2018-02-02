const express = require('express');
const router = express.Router();

var authorize = require('../middleware/authorization');
var showOwnerAuthorize = require('../middleware/showOwnerAuthorization');

var Show = require('../../models/').Show;

router.get('/', async function (req, res, next) {
	// http://docs.sequelizejs.com/manual/tutorial/querying.html#ordering
	Show.findAll({
		order: [
			['title', 'DESC']
		]
	}).then(function(shows) {
		res.render('shows.ejs', {shows: shows});
	}).catch(function(err) {
		console.log(err);
	})
});

/* showOwner Pages*/
router.get('/addshow', showOwnerAuthorize, function (req, res, next) {
	res.render('addShow.ejs');
});

module.exports = router;
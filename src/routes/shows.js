const express = require('express');
const router = express.Router();

var authorize = require('../middleware/authorization');
var showOwnerAuthorize = require('../middleware/showOwnerAuthorization');

var Show = require('../../models/').Show;
var User = require('../../models/').User;
var Company = require('../../models/').Company;


router.get('/', function (req, res, next) {
	// http://docs.sequelizejs.com/manual/tutorial/querying.html#ordering
	var isShowOwner = false;
	if (!req.user) {
		Show.findAll({
		order: [
			['title', 'DESC']
		]
		}).then(function(shows) {
			res.render('shows.ejs', {shows: shows, isShowOwner: isShowOwner});
		}).catch(function(err) {
			console.log(err);
		});
	} else {

	User.findById(req.user.id)
		.then(function(user) {
			if (!user) {
			}

			if (user.role === 'user') {
			} else {
				Company.findById(user.role)
					.then(function (company) {
						if (company) {
							isShowOwner = true;
						} else {
						}

						Show.findAll({
							order: [
								['title', 'DESC']
							]
						}).then(function(shows) {
							res.render('shows.ejs', {shows: shows, isShowOwner: isShowOwner});
						}).catch(function(err) {
							console.log(err);
						});
				});
			}
		}).catch(function(err) {
			console.log(err);
			res.redirect('/');
		});

	}
});


/* showOwner Pages*/
router.get('/addshow', showOwnerAuthorize, function (req, res, next) {
	res.render('addShow.ejs');
});

router.post('/addshow', showOwnerAuthorize, function (req, res, next) {
	User.findById(req.user.id)
		.then(function (user) {
			if (!user) {
				// no such user found
				res.status(404).send("Sorry, something went wrong with your request.");
			} else {
				var genres = [];
				var dates = [];
				genres.push(req.body["genre[]"]);
				dates.push(req.body["date[]"]);
								
				Show.create({
					'title': req.body.title,
					'venue': req.body.venue,
					'genre': genres,
					'date': dates,
					'company_id': user.role
				}).then(function (show) {
					return res.send(show);
				}).catch(function (err) {
					console.log(err);
					return res.send(null);
				});
			}
		}).catch(function (err) {
			console.log(err);
		});
});
/* End showOwner Pages */

router.get('/:showId', function(req, res, next) {
	// no user logged in
	Show.findById(req.params.showId)
		.then(function (show) {
			if (!show) {
				// no such show exists
				res.status(404).send("Sorry, we can't find a show by that id.");
			}

			res.render('show.ejs', {
				'title': show.title,
				'venue': show.venue,
				'genre': show.genre,
				'date': show.date
			});
		}).catch(function (err) {
			// invalid input format
			res.status(404).send("Sorry, we can't find a show by that id.");
			console.log(err);
		})
});

module.exports = router;
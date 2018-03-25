const express = require('express');
const router = express.Router();

var showOwnerAuthorize = require('../middleware/showOwnerAuthorization');

var User = require('../../models/').User;
var Audition = require('../../models/').Audition;
var Company = require('../../models/').Company;
var Show = require('../../models/').Show;

router.get('/', function (req, res, next) {
	// http://docs.sequelizejs.com/manual/tutorial/querying.html#ordering
	var isShowOwner = false;
	if (!req.user) {
		Audition.findAll({
		order: [
			['date', 'DESC']
		]
		}).then(function(auditions) {
			res.render('auditions.ejs', {auditions: auditions, isShowOwner: isShowOwner});
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

						Audition.findAll({
							order: [
								['date', 'DESC']
							]
						}).then(function(auditions) {
							res.render('auditions.ejs', {auditions: auditions, isShowOwner: isShowOwner});
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
router.get('/addaudition', showOwnerAuthorize, function (req, res, next) {
	// allow user to make auditions for only shows the user is a showOwner of
	User.findById(req.user.id)
		.then(function(user) {
			// user is a show owner or admin
			Company.findById(user.role)
				.then(function (company) {
					Show.findAll({
						where: {
							'company_id': company.id
						}
					}).then(function(shows) {
						res.render('addAudition.ejs', {shows: shows});
					}).catch(function(err) {
						console.log(err);
					});
				});
		}).catch(function(err) {
			console.log(err);
			res.redirect('/');
		});	
});

router.post('/addaudition', showOwnerAuthorize, function (req, res, next) {
	var data = Object.values(req.body);
	if (typeof data[4] == "string") {
		data[4] = [data[4]];
	}

	User.findById(req.user.id)
		.then(function (user) {
			if (!user) {
				// no such user found
				res.status(404).send("Sorry, something went wrong with your request.");
			} else {
				Audition.create({
					'show_id': data[0],
					'venue': data[1],
					'contact': data[2],
					'notes': data[3],
					'date': data[4],
					'company_id': user.role
				}).then(function (audition) {
					return res.send(audition);
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

// Each auditionId carries all auditions for a specified showId
router.get('/:auditionId', function(req, res, next) {
	// no user logged in
	Audition.findById(req.params.auditionId)
		.then(function (audition) {
			if (!audition) {
				// no such audition exists
				res.status(404).send("Sorry, we can't find an audition by that id.");
			}

			Show.findById(audition.show_id)
				.then(function(show) {
					res.render('audition.ejs', {
						title: show.title,					
						venue: audition.venue,
						contact: audition.contact,
						notes: audition.notes,
						date: audition.date
					});					
				}).catch(function(err) {
					console.log(err);
				});
		}).catch(function (err) {
			// invalid input format
			res.status(404).send("Sorry, we can't find an audition by that id.");
			console.log(err);
		})
});


module.exports = router;
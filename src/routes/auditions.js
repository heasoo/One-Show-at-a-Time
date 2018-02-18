const express = require('express');
const router = express.Router();

var showOwnerAuthorize = require('../middleware/showOwnerAuthorization');

var User = require('../../models/').User;
var Audition = require('../../models/').Audition;
var Company = require('../../models/').Company;

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
	res.render('addaudition.ejs');
});


module.exports = router;
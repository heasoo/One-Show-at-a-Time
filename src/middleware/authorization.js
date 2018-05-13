import * as express from 'express';
var passport = require('passport');
var User = require('../../models').User;
var Company = require('../../models').Company;

var authorization = {

	loggedIn(url) {
		return function(req, res, next) {
			if (req.user) {
				console.log('user is logged in');
				next();
			} else {
				console.log('authorization failed');
				res.render('notLoggedIn.ejs', {redirect: url});
			}
		}
	},

	showOwner(url) {
	 	return function(req, res, next) {
			User.findById(req.user.id)
				.then(function(user) {
					if (!user) {
						console.log('no such user exists');
						return res.render('notShowOwner.ejs', {redirect: url});
					}

					if (user.role === 'user') {
						console.log('show owner authorization failed');
						return res.redirect('notShowOwner.ejs', {redirect: url});
					} else {
						Company.findById(user.role)
							.then(function (company) {
								if (company) {
									console.log('show owner authorization success');
									return next();
								} else {
									console.log('show owner authorization failed');
									return res.redirect('notShowOwner.ejs', {redirect: url});
								}
							});
					}
				}).catch(function(err) {
					return res.redirect('/');
					console.log(err);
				});

		}
	}
	

}

module.exports = authorization;

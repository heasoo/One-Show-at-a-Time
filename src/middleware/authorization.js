import * as express from 'express';
var passport = require('passport');
var User = require('../../models').User;

var authorization = {
	loggedIn: function(req, res, next) {
		// TODO: verify user
		// - Verify by email
		// - Verify by Facebook
		if (req.user) {
			next();
		} else {
			// TODO
			res.redirect('/');
			console.log('authorization failed');
		}
	},

	role: function(user, req, res, next) {
		if (!user) {
			console.log('no user logged in');
			return false;
		}

		User.findOne({
			where: {
				'id': user.id,
				'role': 'showOwner'
				}
			}).then(function(_user) {
				if (_user) {
					console.log('user exists');
					return true;
				}

				console.log('no such user');
				return false;
			}).catch(function(err) {
				console.log(err);
				return false;
			});
		
	}
}

module.exports = authorization;

var User = require('../../models').User;
var Company = require('../../models').Company;

var showOwnerAuthorization = 
	function(req, res, next) {
		if (!req.user) {
			// TODO
			console.log('no user logged in');
			return res.redirect('/');	
		}
		User.findById(req.user.id)
			.then(function(user) {
				if (!user) {
					// TODO
					return res.redirect('/');
					console.log('no such user exists');
				}

				if (user.role === 'user') {
					// TODO
					console.log('show owner authorization failed');
					return res.redirect('/');
				} else {
					Company.findById(user.role)
						.then(function (company) {
							if (company) {
								console.log('show owner authorization success');
								return next();
							} else {
								// TODO
								console.log('show owner authorization failed');
								return res.redirect('/');
							}
						});
				}
			}).catch(function(err) {
				return res.redirect('/');
				console.log(err);
			});

	};


module.exports = showOwnerAuthorization;

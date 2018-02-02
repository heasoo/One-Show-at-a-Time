var User = require('../../models').User
;
var showOwnerAuthorization = 
	function(req, res, next) {
		if (!req.user) {
			// TODO
			console.log('no user logged in');
			res.redirect('/');
		}
		User.findById(req.user.id)
			.then(function(user) {
				if (!user) {
					// TODO
					return res.redirect('/');
					console.log('no such user exists');
				}

				if (user.role ==='showOwner') {
					console.log('show owner authorization success');
					next();
				} else {
					// TODO
					console.log('show owner authorization failed');
					return res.redirect('/');
				}
			}).catch(function(err) {
				return res.redirect('/');
				console.log(err);
			});

	};


module.exports = showOwnerAuthorization;

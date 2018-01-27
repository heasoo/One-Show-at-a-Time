var adminAuthorization = {
	loggedIn: function(req, res, next) {
		if (req.user.role === 'admin') {
			next();
		} else {
			// TODO
			res.redirect('/');
		}
	}
}

module.exports = adminAuthorization;

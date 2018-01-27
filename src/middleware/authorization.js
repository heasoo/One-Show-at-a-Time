var authorization = {
	loggedIn: function(req, res, next) {
		if (req.user) {
			next();
		} else {
			// TODO
			res.redirect('/');
		}
	}
}

module.exports = authorization;

var adminAuthorization = {
	loggedIn: function(req, res, next) {
		if (req.user.role === 'admin') {
			next();
		} else {
			// TODO
			res.redirect('/');
			console.log('admin authorization failed');
		}
	}
}

module.exports = adminAuthorization;

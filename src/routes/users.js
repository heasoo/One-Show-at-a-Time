const express = require('express');
const router = express.Router();
var LocalUser = require('../../models').LocalUser;
var FacebookUser = require('../../models').FacebookUser;
var FB = require('fb');
FB.options({version: 'v2.11'});

var passport = require('../middleware/passport');
var multer = require('multer');

/* Roles */
var authorize = require('../middleware/authorization');
//var adminAuthorize = require('../middleware/adminAuthorization');

var storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, '../../public/images');
	},
	filename: function(req, file, callback) {
		var mt = file.mimetype;
		var slashPos = mt.indexOf("/");
		var extension = mt.substring(slashPos + 1);
		if (mt.substring(0, slashPos) != "image") {
			throw new Error('Upload file not an image.');
		}

		LocalUser.findById(req.user.id)
			.then(function(localuser) {
				localuser.profile_picture = '/images/' + req.user.id + '.' + extension;
			}).catch(function(err) {
				console.log(err);
			});
		callback(null, req.user.id + '.' + extension);
	}
});

var upload = multer({ storage: storage}).single('uploadImage');

router.post('/login', function(req, res, next) {
	passport.authenticate('local-login',
		function(err, user, info) {
			if (err) {
				return next(err);
			}

            // no such user
            if (!user) {
            	return res.send(info);
            }

            // success
            req.logIn(user, function(err) {
            	if (err) {
            		return next(err);
            	}
            	return res.send({valid: true});
            });
        })(req, res, next);
    });

router.post('/signup', function(req, res, next) {
	passport.authenticate('local-signup', 
		function(err, user, info) {
			if (err) {
				return next(err);
			}

			// user already exists
			if (!user) {
				console.log(info);
				return res.send(info);
			}

			// success
			req.logIn(user, function(err) {
				if (err) {
					return next(err);
				}
				return res.send({valid: true});
			});
	})(req, res, next);
});

router.get('/auth/facebook', passport.authenticate('facebook', {

}));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
		successRedirect: '/users/profile',
		failureRedirect: '/users/logout'				
}));

router.get('/logout', authorize.loggedIn, function(req, res) {
	/*** Change TEST_URL to HOST_URL when deploying***/
	var TEST_URL = req.protocol + "://" + req.hostname + ":" + 3000;
	var HOST_URL = req.protocol + "://" + req.hostname + "/";
	var ACCESS_TOKEN = FB.getAccessToken();

	if (ACCESS_TOKEN) {
		req.session.destroy(function (err) {
	  		if (err) return next(err);
    		res.clearCookie('connect.sid');
    		res.redirect('https://www.facebook.com/logout.php?next=' + TEST_URL + '&access_token=' + ACCESS_TOKEN); /*TODO change testurl to real*/
		});	
	} else {
		req.session.destroy(function (err) {
		  	if (err) return next(err);
    		res.clearCookie('connect.sid');
    		res.redirect('/');
		});
	}
});


router.get('/profile', authorize.loggedIn, function(req, res) {
	res.render('profile.ejs');
});

router.get('/calendar', authorize.loggedIn, function(req, res) {
	res.render('calendar.ejs');
})

router.get('/editprofile', authorize.loggedIn, function(req, res) {
	res.render('editProfile.ejs');
});


module.exports = router;
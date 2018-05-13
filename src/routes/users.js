const express = require('express');
const router = express.Router();
var fs = require('fs');

var User = require('../../models').User;
var LocalUser = require('../../models').LocalUser;
var FacebookUser = require('../../models').FacebookUser;
var AttendingShow = require('../../models').AttendingShow;
var Show = require('../../models').Show;

var FB = require('fb');
FB.options({version: 'v2.11'});

var passport = require('../middleware/passport');

/* Roles */
var authorize = require('../middleware/authorization');

var multer = require('multer');
var storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, './public/images/users');
	},
	filename: function(req, file, callback) {
		var mt = file.mimetype;
		var slashPos = mt.indexOf("/");
		var extension = mt.substring(slashPos + 1).toLowerCase();

		// if file by req.user.id exists already, delete it
	    var files = fs.readdirSync('./public/images/users');
	    files.forEach(function(file) {
	    	var basename = file.substring(0, file.lastIndexOf('.'));
	    	if (basename === req.user.id) {
	    		// basenames match
	    		console.log('name already exists');

	    		fs.unlink('./public/images/users/' + file, (err) => {
	    			if (err) throw err;
	    			console.log('file deleted');
	    		});
	    	}
	    });
	    return callback(null, req.user.id + '.' + extension);
	}
});

var upload = multer({
	fileFilter: function (req, file, callback) {
		// images only
		var mt = file.mimetype;
        var slashPos = mt.indexOf("/");
        var extension = mt.substring(slashPos + 1).toLowerCase();

    	if (!extension.match(/(jpg|jpeg|png)$/i)) {
    		console.log('File is not an image');
    		return callback(new Error('File is not an image.'));

	    }
	    return callback(null, true);
	},
	storage : storage
}).single('fileupload');

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

router.get('/logout', authorize.loggedIn('/users/logout'), function(req, res) {
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


router.get('/profile', authorize.loggedIn('/users/profile'), function(req, res) {
	LocalUser.findById(req.user.id)
	.then(function(localuser) {
		if (!localuser) {
			// user is a FB user
			FacebookUser.findById(req.user.id)
			.then(function(fbuser) {
				res.render('profile.ejs', {user: fbuser})
			}).catch(function(err) {
				console.log(err);
			});
		} else {
			// user is a local user
			res.render('profile.ejs', {user: localuser});
		}
	}).catch(function(err) {
		console.log(err);
	});
});

router.get('/calendar', authorize.loggedIn('/users/calendar'), function(req, res) {
	res.render('calendar.ejs');
});

router.post('/calendar', authorize.loggedIn('/users/calendar'), function(req, res) {
	//https://fullcalendar.io/docs/event-object
	AttendingShow.findAll({
		where: {
			user_id: req.user.id,
		}
	}).then(function(attendingshows) {
		if (!attendingshows) {
			res.send("no shows");		
		} else {
			var completedRequests = 0;

			var data = [];
			for (let i = 0; i < Object.keys(attendingshows).length; i++) {
				if (attendingshows[i].date.length > 1) {
					var completedRequests2 = 0;
					for (let j = 0; j < attendingshows[i].date.length; j++) {
						Show.findById(attendingshows[i].show_id)
						.then(function(show) {
							// add an Event Object to data array for each show date
							var obj = {};
							obj['url'] = "/shows/" + show.id;
							obj['title'] = show.title;
							obj['start'] = attendingshows[i].date[j].toString();
							data.push(obj);
							
							completedRequests2++;

							if (completedRequests2 == attendingshows[i].date.length) {
								completedRequests++;
								if (completedRequests == Object.keys(attendingshows).length) {
									console.log(data);
									res.send(data);
								}
							}
						}).catch(function (err) {
							console.log(err);
						});
					}
				} else {
					Show.findById(attendingshows[i].show_id)
						.then(function(show) {
							// add an Event Object to data array for each show date
							var obj = {};
							obj['url'] = "/shows/" + show.id;
							obj['title'] = show.title;
							obj['start'] = attendingshows[i].date.toString();
							data.push(obj);
							
							completedRequests++;

							if (completedRequests == Object.keys(attendingshows).length) {
								console.log(data);
								res.send(data);
							}
						}).catch(function (err) {
							console.log(err);
						});
				}
			}
			/*var completedRequests = 0;

			var data = [];
			for (let i = 0; i < Object.keys(attendingshows).length; i++) {
				Show.findById(attendingshows[i].show_id)
					.then(function(show) {
						// add an Event Object to data array for each show date
						var obj = {};
						obj['url'] = "/shows/" + show.id;
						obj['title'] = show.title;
						obj['start'] = attendingshows[i].date.toString();
						data.push(obj);
						
						completedRequests++;

						if (completedRequests == Object.keys(attendingshows).length) {
							console.log(data);
							res.send(data);
						}
					}).catch(function (err) {
						console.log(err);
					});
			}*/
		}
	}).catch(function(err) {
		console.log(err);
	})
})

router.get('/editprofile', authorize.loggedIn('/users/editprofile'), function(req, res) {
	// TODO
	// If local user, redirect to edit profile page
	LocalUser.findById(req.user.id)
	.then(function(localuser) {
		if (!localuser) {
			// User is a FB user
			FacebookUser.findById(req.user.id)
			.then(function(fbuser) {
				if (!fbuser) {
					// User is neither FB or local
					// ???
					res.status(404).send("Sorry something went wrong with your request");
				}

				// TODO: redirect to FB

			}).catch(function(err) {
				console.log(err);
			});
		} else {
			// User is a local user
			res.render('editProfile.ejs', {user: localuser});
		}
	}).catch(function(err) {
		console.log(err);
		res.status(404).send("Sorry something went wrong with your request");
	});

	// If FB user, redirect to FB edit profile page
});

router.post('/editprofile', authorize.loggedIn('/users/editprofile'), function(req, res, next) {
	// data[name, email, newPhoto]
	console.log('editing profile');
	LocalUser.update({
		name: req.body.name,
		email: req.body.email,
	}, {
		where: {id: req.user.id},
		returning: true,
		plain: true
	}).then(function(localuser) {
		localuser = localuser[1];

		// if newPhoto == false, use previously saved photo
		// if newPhoto == true, must update user with new photo
		if (req.body.newPhoto) {
			var files = fs.readdirSync('./public/images/users');
			var file = files.find(function(element) {
				return element.includes(req.user.id);
			});
			var extension = file.substring(file.lastIndexOf("."), file.length);
			localuser.update({
				profile_picture: '/images/users/' + localuser.id + extension
			}).then(function() {});
		}
		return res.send({result: 'OK'});
	}).catch(function(err) {
		console.log(err);
	});
});

router.get('/:userId', authorize.loggedIn('/'), function(req, res, next) {
	var date = new Date();
	// TODO: recently attended shows
	if (req.user.id == req.params.userId) {
		res.render('profile.ejs');
	} else {
		FacebookUser.findById(req.params.userId)
			.then(function(fbuser) {
				if (!fbuser) {
					LocalUser.findById(req.params.userId)
						.then(function(localuser) {
							if (!localuser) {
								res.status(404).send("Sorry, something went wrong with your request");
							}

							res.render('publicProfile.ejs', {
										'name': localuser.name,
										'picture': localuser.profile_picture
									});
/*							AttendingShow.findAll({
								where: {
									user_id: localuser.id
								}
							}).then(function(attendingshow) {
								if (!attendingshow) {
								// user has no attending shows
									res.render('publicProfile.ejs', {
										'name': localuser.name,
										'picture': localuser.profile_picture,
										'shows': []
									});
								} else {
									// user has attending shows

								}
							}).catch(function(err) {
								console.log(err);
							});*/

						}).catch(function(err) {
							console.log(err);
						});
				} else {
					res.render('publicProfile.ejs', {
						'name': fbuser.name,
						'picture': fbuser.profile_picture
					});
				}
			}).catch(function(err) {
				console.log(err);
			});
	}
});

router.post('/uploadPhoto', authorize.loggedIn('users/editprofile'), function(req, res, next) {
	// photo is uploaded as the user's id
	console.log('uploading photo');
    upload(req,res,function(err) {
    	if (err) {
    		console.log(err);
    		return res.status(500).send({ error: 'File is not an image.'});
    	}
        return res.send({result: 'picture uploaded'});
    });
});
module.exports = router;
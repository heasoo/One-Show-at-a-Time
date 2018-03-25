const express = require('express');
const router = express.Router();
var fs = require('fs');

var authorize = require('../middleware/authorization');
var showOwnerAuthorize = require('../middleware/showOwnerAuthorization');

var Show = require('../../models/').Show;
var User = require('../../models/').User;
var Company = require('../../models/').Company;

var multer = require('multer');
var storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, './public/images');
	},
	filename: function(req, file, callback) {
		var mt = file.mimetype;
        var slashPos = mt.indexOf("/");
        var extension = mt.substring(slashPos + 1).toLowerCase();
		// var showId = show.id;
		// Show.findById(showId)
		// 	.then(function(_show) {
		// 		_show.picture = '/images/' + _show.id + '.' + extension;
		// 	}).catch(function(err) {
		// 		console.log(err);
		// 	});

		// if file by req.user.id exists already, delete it
	    var files = fs.readdirSync('./public/images/');
	    files.forEach(function(file) {
	    	var basename = file.substring(0, file.lastIndexOf('.'));
	    	if (basename === req.user.id) {
	    		// basenames match
	    		console.log('name already exists');

	    		fs.unlink('./public/images/' + file, (err) => {
	    			if (err) throw err;
	    			console.log('file deleted');
	    		});
	    	}
	    });
		callback(null, req.user.id + '.' + extension);
	}
});

var upload = multer({
	storage : storage,
	fileFilter: function (req, file, cb) {
		// images only
    	if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png)$/)) {
    		console.log('not an image');
    		req.fileValidationError = 'file is not an image';
        	return cb(new Error('Only image files are allowed!'));
	    }
	    cb(null, true);
}}).single('fileupload');

router.get('/', function (req, res, next) {
	// http://docs.sequelizejs.com/manual/tutorial/querying.html#ordering
	var isShowOwner = false;
	
	var burlesque = [];
	var comedy = [];
	var musical = [];
	var play = [];
	var tragedy = [];
	var romance = [];

	if (!req.user) {
		Show.findAll({
		}).then(function(shows) {
			for (var i = 0; i < shows.length; i++) {
				var JSONString = JSON.stringify(shows[i].genre);

				if (JSONString.indexOf('Burlesque') != -1) {
					burlesque.push(shows[i]);
				}

				if (JSONString.indexOf('Comedy') != -1) {
					comedy.push(shows[i]);
				}

				if (JSONString.indexOf('Musical Theatre') != -1) {
					musical.push(shows[i]);
				}

				if (JSONString.indexOf('Play') != -1) {
					play.push(shows[i]);
				}

				if (JSONString.indexOf('Tragedy') != -1) {
					tragedy.push(shows[i]);
				}

				if (JSONString.indexOf('Romance') != -1) {
					romance.push(shows[i]);
				}

			}
			res.render('shows.ejs', {
				isShowOwner: isShowOwner,
				burlesque: burlesque,
				comedy: comedy,
				musical: musical,
				play: play,
				tragedy: tragedy,
				romance: romance
			});
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

						Show.findAll({
						}).then(function(shows) {
							for (var i = 0; i < shows.length; i++) {
								var JSONString = JSON.stringify(shows[i].genre);
								if (JSONString.includes('Burlesque')) {
									burlesque.push(shows[i]);
								}

								if (JSONString.includes('Comedy')) {
									comedy.push(shows[i]);
								}

								if (JSONString.includes('Musical Theatre')) {
									musical.push(shows[i]);
								}

								if (JSONString.includes('Play')) {
									play.push(shows[i]);
								}

								if (JSONString.includes('Tragedy')) {
									tragedy.push(shows[i]);
								}

								if (JSONString.includes('Romance')) {
									romance.push(shows[i]);
								}
							}
							res.render('shows.ejs', {
								isShowOwner: isShowOwner,
								burlesque: burlesque,
								comedy: comedy,
								musical: musical,
								play: play,
								tragedy: tragedy,
								romance: romance
							});
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
router.get('/addshow', showOwnerAuthorize, function (req, res, next) {
	res.render('addShow.ejs');
});


router.post('/addshow', showOwnerAuthorize, function (req, res, next) {
	console.log(req.body);
	var data = Object.values(req.body);
	if (typeof data[2] == "string") {
		data[2] = [data[2]];
	}

	if (typeof data[3] == "string") {
		data[3] = [data[3]];
	}
	console.log(data);
	User.findById(req.user.id)
		.then(function (user) {
			if (!user) {
				// no such user found
				res.status(404).send("Sorry, something went wrong with your request.");
			} else {			
				Show.create({
					'title': data[0],
					'venue': data[1],
					'genre': data[2],
					'date': data[3],
					'company_id': user.role
				}).then(function (show) {
					console.log('renaming');
					var files = fs.readdirSync('./public/images/');
					var file = files.find(function(element) {
						return element.includes(req.user.id);
					})
					var extension = file.substring(file.lastIndexOf("."), file.length);

				    fs.renameSync('./public/images/' + file, './public/images/' + show.id + extension);
				    show.update({
				    	picture: '/images/' + show.id + extension
				    }).then(function() {});
					//show.picture = '/images/' + show.id + extension;
					console.log(show.picture);
					return res.send(show);
				}).catch(function (err) {
					console.log(err);
					res.status(404).send("Sorry, something went wrong with your request.");
				});
			}
		}).catch(function (err) {
			console.log(err);
		});
});

router.post('/uploadPhoto', showOwnerAuthorize, function(req, res, next) {
    upload(req,res,function(err) {
    	if (err) {
    		return res.send({error: err});
    	}
        return res.send({result: 'picture uploaded'});
    });

});
/* End showOwner Pages */

router.get('/:showId', function(req, res, next) {
	// no user logged in
	Show.findById(req.params.showId)
		.then(function (show) {
			if (!show) {
				// no such show exists
				res.status(404).send("Sorry, we can't find a show by that id.");
			}

			res.render('show.ejs', {
				'title': show.title,
				'venue': show.venue,
				'genre': show.genre,
				'date': show.date
			});
		}).catch(function (err) {
			// invalid input format
			res.status(404).send("Sorry, we can't find a show by that id.");
			console.log(err);
		})
});

module.exports = router;
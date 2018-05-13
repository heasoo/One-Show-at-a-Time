const express = require('express');
const router = express.Router();
var Sequelize = require('sequelize');
var fs = require('fs');
const Op = Sequelize.Op;

var authorize = require('../middleware/authorization');

var Show = require('../../models/').Show;
var User = require('../../models/').User;
var Company = require('../../models/').Company;
var AttendingShow = require('../../models/').AttendingShow;
var FacebookUser = require('../../models/').FacebookUser;
var LocalUser = require('../../models/').LocalUser;

var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyCqD0RPTp6wV2-Qr2N3LPYLeK9_8qZt1wI',
  Promise: Promise
});

var multer = require('multer');
var storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, './public/images/shows');
	},
	filename: function(req, file, callback) {
		var mt = file.mimetype;
        var slashPos = mt.indexOf("/");
        var extension = mt.substring(slashPos + 1).toLowerCase();

		// if file by req.user.id exists already, delete it
	    var files = fs.readdirSync('./public/images/shows');
	    files.forEach(function(file) {
	    	var basename = file.substring(0, file.lastIndexOf('.'));
	    	if (basename === req.user.id) {
	    		// basenames match
	    		console.log('name already exists');

	    		fs.unlink('./public/images/shows/' + file, (err) => {
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

router.get('/', function (req, res, next) {
	var isShowOwner = false;
	
	var burlesque = [];
	var comedy = [];
	var musical = [];
	var play = [];
	var tragedy = [];
	var romance = []; 

	var startDate = new Date();
	var endDate = new Date();
	endDate.setMonth(endDate.getMonth() + 1); 

	if (!req.user) {
		Show.findAll({
		 	order: [
		 		['date', 'ASC']
		 	],
			where: {
				range: {
					[Op.overlap]: [startDate, endDate]
				}
			}
		}).then(function(shows) {
			console.log(shows.length);
			for (let i = 0; i < shows.length; i++) {
				var now = new Date();
				for (let j = 0; j < shows[i].date.length; j++) {
					if (shows[i].date[j] <= now) {
						// go onto next
					} else {
						// convert to 12-hour time
						// Pre Conversion Ex: Fri Apr 20 2018 22:48:41 GMT-0700 (Pacific Summer Time)
						var date = shows[i].date[j].toString().slice(0, 16); // Fri Apr 20 2018
						var time = shows[i].date[j].toString().slice(16);// 22:48:41 GMT-0700 (Pacific Summer Time)
						var hour = time.slice(0, time.indexOf(":"));// 22 
						var suffix = hour >= 12? "PM":"AM";		// PM
						hour = (Number(hour) + 11) % 12 + 1;
						time = time.slice(time.indexOf(":") + 1);	// 48:41 GMT-0700 (Pacific Summer Time)
						var minute = time.slice(0, time.indexOf(":")); 
						hour = (hour + 11) % 12 + 1;

						time = date + hour + ":" + minute + " " + suffix;
						shows[i].closestDate = time;
					}
				}
				
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
			if (user.role === 'user') {
				Show.findAll({
					order: [
		 				['date', 'ASC']
				 	],
					where: {
						range: {
							[Op.overlap]: [startDate, endDate]
						}
					}
				}).then(function(shows) {
					for (let i = 0; i < shows.length; i++) {
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
				Company.findById(user.role)
					.then(function (company) {
						if (company) {
							isShowOwner = true;
						} else {
						}

						Show.findAll({
						}).then(function(shows) {
							for (let i = 0; i < shows.length; i++) {
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
router.get('/addshow', authorize.loggedIn('/shows/addshow'), authorize.showOwner('/shows/addshow'), function (req, res, next) {
	res.render('addShow.ejs');
});


router.post('/addshow', authorize.loggedIn('/shows/addshow'), authorize.showOwner('/shows/addshow'), function (req, res, next) {
	var data = Object.values(req.body);

	// Genre
	if (typeof data[2] == "string") {
		data[2] = [data[2]];
	}

	// Date
	if (typeof data[3] == "string") {
		data[3] = [data[3]];
	}

	// Range
	if (typeof data[5] == "string") {
		data[5] = [data[5]];
	}
	console.log(data[5]);
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
					'company_id': user.role,
					'range': data[5]		
				}).then(function (show) {
					console.log(show);
					// if customPhoto is false, default show picture is used
					// if customPhoto is true, must rename uploaded photo from user id to show id
					if (data[4] == "true") {
						console.log('renaming');
						var files = fs.readdirSync('./public/images/shows');
						var file = files.find(function(element) {
							return element.includes(req.user.id);
						})
						var extension = file.substring(file.lastIndexOf("."), file.length);

					    fs.renameSync('./public/images/shows/' + file, './public/images/shows/' + show.id + extension);
					    show.update({
					    	picture: '/images/shows/' + show.id + extension
					    }).then(function() {});
						console.log(show.picture);
					}
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

router.post('/uploadPhoto', authorize.loggedIn('/shows/addshow'), authorize.showOwner('/shows/addshow'), function(req, res, next) {
	// photo is initially uploaded as the user's id
    upload(req,res,function(err) {
    	if (err) {
    		console.log(err);
    		return res.status(500).send({ error: 'File is not an image.'});
    	}
        return res.send({result: 'picture uploaded'});
    });
});
/* End showOwner Pages */

router.get('/:showId', function(req, res, next) {
	if (req.user) {
		// user is logged in
		Show.findById(req.params.showId)
			.then(function (show) {
				if (!show) {
					// no such show exists
					res.status(404).send("Sorry, we can't find a show by that id.");
				}

				Company.findById(show.company_id)
					.then(function(company) {
						AttendingShow.findAll({
							// Find all attending this show
							where: {
								show_id: show.id,
								role_desc: {
									[Op.or]: ['cast', 'creative', 'band']
								}
							}
						}).then(function(attendingShows) {
							AttendingShow.findOne({
								where: {
									show_id: show.id,
									user_id: req.user.id
								}
							}).then(function(attendingShow) {
								var currentlyAttending = [];
								if (attendingShow) {
									currentlyAttending = attendingShow.date.toString();
								}

								console.log(currentlyAttending);
								// req.user is not attending this show
								var futureDates = [];
								var status = "Not Attending";
								if (!attendingShow) {
									// do nothing
								} else {
									// req.user is attending this show
									status = "Attending";

								}

								var _completedRequests = 0;
								var _date = new Date();

								for (let k = 0; k < show.date.length; k++) {
									if (show.date[k] <= _date) {
										// do not add to futureDates
									} else {
										futureDates.push(show.date[k]);
									}

									_completedRequests++;

									if (_completedRequests == show.date.length) {
										console.log('futureDates:' + futureDates);	
									}
								}

								var isShowOwner = false;
								User.findById(req.user.id)
								.then(function(user) {
									if (user.role == show.company_id) {
										isShowOwner = true;
									}

									var cast = [];
									var creative = [];
									var band = [];

									var completedRequests = 0;

									if (Object.keys(attendingShows).length == 0) {
										googleMapsClient.place({
											placeid: show.venue
										}).asPromise()
										.then(function(response) {
											// show.venue is a Google Map address
											console.log('no creatives exist, show venue is a Google Maps address');
											res.render('show.ejs', {
														'show': show,		/*TODO: put an appropriate glyphicon for each genre*/
														'company': company,
														'cast': cast,
														'creative': creative,
														'band': band,
														'isLoggedIn': true,
														'isValidGoogleMap': true,
														'venue': response.json.result.name,
														'isShowOwner': isShowOwner,
														'status': status,
														'user_id': req.user.id,
														'futureDates': futureDates,
														'currentlyAttending': currentlyAttending
											});	
										}).catch(function(err) {
											// show.venue is not a Google Map address
											console.log('no creatives exist, show venue is not a Google Maps address');
											console.log(isShowOwner);
											res.render('show.ejs', {
														'show': show,		/*TODO: put an appropriate glyphicon for each genre*/
														'company': company,
														'cast': cast,
														'creative': creative,
														'band': band,
														'isLoggedIn': true,
														'isValidGoogleMap': false,
														'venue': show.venue,
														'isShowOwner': isShowOwner,
														'status': status,
														'user_id': req.user.id,
														'futureDates': futureDates,
														'currentlyAttending': currentlyAttending
											});	
										});
									} else {
										for (let i = 0; i < Object.keys(attendingShows).length; i++) {
											LocalUser.findById(attendingShows[i].user_id)
												.then(function(localuser) {
													if (localuser) {
														completedRequests++;

														if (attendingShows[i].role_desc == "cast") {
															cast.push(localuser);
														}
														if (attendingShows[i].role_desc == "creative") {
															creative.push(localuser);
														}
														if (attendingShows[i].role_desc == "band") {
															band.push(localuser);
														}
													} else {
														// no such local user exists
														FacebookUser.findById(attendingShows[i].user_id)
															.then(function(fbuser) {
																if (fbuser) {
																	completedRequests++;

																	if (attendingShows[i].role_desc == "cast") {
																		cast.push(localuser);
																	}
																	if (attendingShows[i].role_desc == "creative") {
																		creative.push(localuser);
																	}
																	if (attendingShows[i].role_desc == "band") {
																		band.push(localuser);
																	}														
																} else {
																	res.status(404).send('Something went wrong with your request. Please try again.');
																}

															}).catch(function(err) {
																console.log(err);
															});
													}
													if (completedRequests == Object.keys(attendingShows).length) {
														googleMapsClient.place({
															placeid: show.venue
														}).asPromise()
														.then(function(response) {
															console.log('creatives exist, show venue is a Google Maps address');
															res.render('show.ejs', {
																		'show': show,		/*TODO: put an appropriate glyphicon for each genre*/
																		'company': company,
																		'cast': cast,
																		'creative': creative,
																		'band': band,
																		'isLoggedIn': true,
																		'isValidGoogleMap': true,
																		'venue': response.json.result.name,
																		'isShowOwner': isShowOwner,
																		'status': status,
																		'user_id': req.user.id,
																		'futureDates': futureDates,
																		'currentlyAttending': currentlyAttending
															});	
														}).catch(function(err) {
															// show.venue is not a Google Map address
															console.log('creatives exist, show venue is not a Google Maps address');;
															res.render('show.ejs', {
																		'show': show,		/*TODO: put an appropriate glyphicon for each genre*/
																		'company': company,
																		'cast': cast,
																		'creative': creative,
																		'band': band,
																		'isLoggedIn': true,
																		'isValidGoogleMap': false,
																		'venue': show.venue,
																		'isShowOwner': isShowOwner,
																		'status': status,
																		'user_id': req.user.id,
																		'futureDates': futureDates,
																		'currentlyAttending': currentlyAttending
															});	
														});
													}
												}).catch(function(err) {
													console.log(err);
												});
										}
									}
								}).catch(function(err) {
									console.log(err);
								});
							}).catch(function(err) {
								console.log(err);
							});
						}).catch(function(err) {
							console.log(err);
						});

						
					}).catch(function (err) {
						res.status(404).send("Sorry, we can't find a show by that id.");
						console.log(err);
					});
			}).catch(function (err) {
				// invalid input format
				res.status(404).send("Sorry, we can't find a show by that id.");
				console.log(err);
			});
	} else {	
		// no user logged in
		Show.findById(req.params.showId)
			.then(function (show) {
				if (!show) {
					// no such show exists
					res.status(404).send("Sorry, we can't find a show by that id.");
				}

				Company.findById(show.company_id)
					.then(function(company) {
						AttendingShow.findAll({
							where: {
								show_id: show.id,
								role_desc: {
									[Op.or]: ['cast', 'creative', 'band']
								}
							}
						}).then(function(attendingShows) {
							console.log('1');
							var cast = [];
							var creative = [];
							var band = [];

							var completedRequests = 0;

							if (Object.keys(attendingShows).length == 0) {
								googleMapsClient.place({
									placeid: show.venue
								}).asPromise()
								.then(function(response) {
									res.render('show.ejs', {
												'show': show,		/*TODO: put an appropriate glyphicon for each genre*/
												'company': company,
												'cast': cast,
												'creative': creative,
												'band': band,
												'isLoggedIn': false,
												'isValidGoogleMap': true,
												'venue': response.json.result.name,
												'isShowOwner': false
									});	
								}).catch(function(err) {
									// show.venue is not a Google Map address
									res.render('show.ejs', {
												'show': show,		/*TODO: put an appropriate glyphicon for each genre*/
												'company': company,
												'cast': cast,
												'creative': creative,
												'band': band,
												'isLoggedIn': false,
												'isValidGoogleMap': false,
												'venue': show.venue,
												'isShowOwner': false
									});	
								});
							} else {

							for (let i = 0; i < Object.keys(attendingShows).length; i++) {
								LocalUser.findById(attendingShows[i].user_id)
									.then(function(localuser) {
										if (localuser) {
											completedRequests++;

											if (attendingShows[i].role_desc == "cast") {
												cast.push(localuser);
											}
											if (attendingShows[i].role_desc == "creative") {
												creative.push(localuser);
											}
											if (attendingShows[i].role_desc == "band") {
												band.push(localuser);
											}
										} else {
											// no such local user exists
											FacebookUser.findById(attendingShows[i].user_id)
												.then(function(fbuser) {

													if (fbuser) {
														completedRequests++;

														if (attendingShows[i].role_desc == "cast") {
															cast.push(localuser);
														}
														if (attendingShows[i].role_desc == "creative") {
															creative.push(localuser);
														}
														if (attendingShows[i].role_desc == "band") {
															band.push(localuser);
														}														
													} else {
														res.status(404).send('Something went wrong with your request. Please try again.');
													}

												}).catch(function(err) {
													console.log(err);
												});
										}
										if (completedRequests == Object.keys(attendingShows).length) {
											googleMapsClient.place({
												placeid: show.venue
											}).asPromise()
											.then(function(response) {
												res.render('show.ejs', {
															'show': show,		/*TODO: put an appropriate glyphicon for each genre*/
															'company': company,
															'cast': cast,
															'creative': creative,
															'band': band,
															'isLoggedIn': false,
															'isValidGoogleMap': true,
															'venue': response.json.result.name,
															'isShowOwner': false
												});	
											}).catch(function(err) {
												// show.venue is not a Google Map address
												res.render('show.ejs', {
															'show': show,		/*TODO: put an appropriate glyphicon for each genre*/
															'company': company,
															'cast': cast,
															'creative': creative,
															'band': band,
															'isLoggedIn': false,
															'isValidGoogleMap': false,
															'venue': show.venue,
															'isShowOwner': false
												});	
											});
										}
									}).catch(function(err) {
										console.log(err);
									});
							}

							}
						}).catch(function(err) {
							console.log(err);
						})

						
					}).catch(function (err) {
						res.status(404).send("Sorry, we can't find a show by that id.");
						console.log(err);
					});
			}).catch(function (err) {
				// invalid input format
				res.status(404).send("Sorry, we can't find a show by that id.");
				console.log(err);
			});
	}
});

router.post('/attendshow', authorize.loggedIn('/shows'), function(req, res, next) { 
	// turn date json into array
	var data = Object.values(req.body);
	if (typeof data[2] == "string") {
		data[2] = [data[2]];
	}

	// Create or update attending show instance
	AttendingShow.findAll({
		where: {
			'show_id': req.body.show_id,
			'user_id': req.body.user_id
		}
	}).then(function(attendingshow) {
		if (!attendingshow || attendingshow.length == 0) {
			AttendingShow.create({
				'show_id': req.body.show_id,
				'user_id': req.body.user_id,
				'date': data[2]
			}).then(function(){
				res.status(200).send('Completed');
			}).catch(function(err) {
				res.status(404).send("Sorry your request could not be completed");
				console.log(err);
			});
		} else {
			AttendingShow.update({
				date: data[2]
				}, {
				where: {
					'show_id': req.body.show_id,
					'user_id': req.body.user_id
				},
				returning: true,
				plain: true
			}).then(function(_attendingshow) {
				console.log('updated');
			}).catch(function(err) {
				console.log(err);
			});
		}
	}).catch(function(err) {
		console.log(err);
		res.status(404).send('Sorry, something went wrong with your request.');	
	});
});

router.post('/attendingshow', authorize.loggedIn('/shows'), function(req, res, next) { 	
	// Delete user and show's attending show instance
	AttendingShow.destroy({
		where: {
			'show_id': req.body.show_id,
			'user_id': req.body.user_id
		}
	}).then(function(attendingshow){
		res.status(200).send('Completed');
	}).catch(function(err) {
		res.status(404).send("Sorry your request could not be completed");
		console.log(err);
	})
});

router.get('/editshow/:showId', authorize.loggedIn('/shows'), authorize.showOwner('/shows'), function(req, res, next) {
	Show.findById(req.params.showId)
	.then(function(show) {
		googleMapsClient.place({
			placeid: show.venue
		}).asPromise()
		.then(function(response) {
			// show.venue is a place id
			res.render('editShow.ejs', {
				show: show,
				venue: response.json.result.name
			});
		}).catch(function(err) {
			// show.venue is not a place id
			res.render('editShow.ejs', {
				show: show,
				venue: show.venue
			});			
		});
	}).catch(function(err) {
		console.log(err);
		res.status(404).send("Sorry, something went wrong with your request");
	});
});

router.post('/editshow', authorize.loggedIn('/shows'), authorize.showOwner('/shows'), function(req, res, next) {
	var data = Object.values(req.body);
	if (typeof data[2] == "string") {
		data[2] = [data[2]];
	}

	if (typeof data[3] == "string") {
		data[3] = [data[3]];
	}
	Show.update({
		title: req.body.title,
		venue: req.body.venue,
		genre: data[2],
		date: data[3],
	}, {
		where: {id: req.body.show_id},
		returning: true,
		plain: true
	}).then(function(show) {
		show = show[1];
		// if newPhoto == false, use previously saved photo
		// if newPhoto == true, must rename photo
		if (req.body.newPhoto === false) {
			console.log('renaming');
			var files = fs.readdirSync('./public/images/shows');
			var file = files.find(function(element) {
				return element.includes(req.user.id);
			});
			var extension = file.substring(file.lastIndexOf("."), file.length);

		    fs.renameSync('./public/images/shows/' + file, './public/images/shows/' + show.id + extension);
		    show.update({
		    	picture: '/images/shows/' + show.id + extension
		    }).then(function() {
		    	console.log('picture updated');
		    });
		}
		return res.send(show);
	}).catch(function(err) {
		console.log(err);
		res.status(404).send("Sorry, something went wrong with your request");
	});

});

module.exports = router;
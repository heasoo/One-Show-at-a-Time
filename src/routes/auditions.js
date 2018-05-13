const express = require('express');
const router = express.Router();

var authorize = require('../middleware/authorization');

var User = require('../../models/').User;
var LocalUser = require('../../models/').LocalUser;
var FacebookUser = require('../../models/').FacebookUser;
var Audition = require('../../models/').Audition;
var Company = require('../../models/').Company;
var Show = require('../../models/').Show;
var AttendingShow = require('../../models/').AttendingShow;

var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyCqD0RPTp6wV2-Qr2N3LPYLeK9_8qZt1wI',
  Promise: Promise
});

router.get('/', function (req, res, next) {
	// http://docs.sequelizejs.com/manual/tutorial/querying.html#ordering
	var isShowOwner = false;
	var dataArray = [];

	if (!req.user) {
		Audition.findAndCountAll({
		order: [
			['date', 'DESC']
		]
		}).then(function(result) {
			console.log(result.count);
			if (result.count === 0) {
				// no auditions
				res.render('auditions.ejs', {data: [], isShowOwner: isShowOwner});
			} else {
				var completedRequests = 0;

				for(let i = 0; i < result.count; i++) {
					Show.findById(result.rows[i].show_id)
						.then(function(show) {
							Company.findById(show.company_id)
								.then(function(company) {
									completedRequests++;

									dataArray[i] = {
										id: result.rows[i].id,
										date: result.rows[i].date,
										show: show.title,
										company: company.name
									};

									console.log('completed requests: ' + completedRequests);

									if (completedRequests == result.count) {
										console.log(dataArray);
										res.render('auditions.ejs', {data: dataArray, isShowOwner: isShowOwner});
									}
								}).catch(function(err) {
									console.log(err);
								});
						}).catch(function(err) {
							console.log(err);
						});
				}
			}
		}).catch(function(err) {
			console.log(err);
		});
	} else {
		// user is signed in
	User.findById(req.user.id)
		.then(function(user) {
			if (user.role === 'user') {
				// regular user
				Audition.findAndCountAll({
					order: [
						['date', 'DESC']
					]
					}).then(function(result) {
						if (result.count === 0) {
							// no auditions
							res.render('auditions.ejs', {data: [], isShowOwner: isShowOwner});
						} else {
							var completedRequests = 0;

							for(let i = 0; i < result.count; i++) {
								Show.findById(result.rows[i].show_id)
									.then(function(show) {
										Company.findById(show.company_id)
											.then(function(company) {
												completedRequests++;

												dataArray[i] = {
													id: result.rows[i].id,
													date: result.rows[i].date,
													show: show.title,
													company: company.name
												};

												console.log('completed requests: ' + completedRequests);

												if (completedRequests == result.count) {
													res.render('auditions.ejs', {data: dataArray, isShowOwner: isShowOwner});
												}
											}).catch(function(err) {
												console.log(err);
											});
									}).catch(function(err) {
										console.log(err);
									});
							}
						}
					}).catch(function(err) {
						console.log(err);
					});
			} else {
				// user is a showOwner
				Company.findById(user.role)
					.then(function (company) {
						if (company) {
							isShowOwner = true;
						}

						Audition.findAndCountAll({
							order: [
								['date', 'DESC']
							]
							}).then(function(result) {
								if (result.count === 0) {
									// no auditions
									res.render('auditions.ejs', {data: [], isShowOwner: isShowOwner});
								} else {
									var completedRequests = 0;

									for(let i = 0; i < result.count; i++) {
										Show.findById(result.rows[i].show_id)
											.then(function(show) {
												Company.findById(show.company_id)
													.then(function(company) {
														completedRequests++;

														dataArray[i] = {
															id: result.rows[i].id,
															date: result.rows[i].date,
															show: show.title,
															company: company.name
														};

														console.log('completed requests: ' + completedRequests);

														if (completedRequests == result.count) {
															console.log(dataArray);
															res.render('auditions.ejs', {data: dataArray, isShowOwner: isShowOwner});
														}
													}).catch(function(err) {
														console.log(err);
													});
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
			}
		}).catch(function(err) {
			console.log(err);
			res.redirect('/');
		});
	}
});

/* showOwner Pages*/
router.get('/addaudition', authorize.loggedIn('/auditions/addaudition'), authorize.showOwner('/auditions/addaudition'), function (req, res, next) {
	// allow user to make auditions for only shows the user is a showOwner of
	User.findById(req.user.id)
		.then(function(user) {
			// user is a show owner or admin
			Company.findById(user.role)
				.then(function (company) {
					Show.findAll({
						where: {
							'company_id': company.id
						}
					}).then(function(shows) {
						res.render('addAudition.ejs', {shows: shows});
					}).catch(function(err) {
						console.log(err);
					});
				});
		}).catch(function(err) {
			console.log(err);
			res.redirect('/');
		});	
});

router.post('/addaudition', authorize.loggedIn('/auditions/addaudition'), authorize.showOwner('/auditions/addaudition'), function (req, res, next) {
	var data = Object.values(req.body);
	if (typeof data[4] == "string") {
		data[4] = [data[4]];
	}

	User.findById(req.user.id)
		.then(function (user) {
			if (!user) {
				// no such user found
				res.status(404).send("Sorry, something went wrong with your request.");
			} else {
				Audition.create({
					'show_id': data[0],
					'venue': data[1],
					'contact': data[2],
					'notes': data[3],
					'date': data[4],
					'company_id': user.role
				}).then(function (audition) {
					return res.send(audition);
				}).catch(function (err) {
					console.log(err);
					return res.send(null);
				});
			}
		}).catch(function (err) {
			console.log(err);
		});
});
/* End showOwner Pages */

router.get('/:auditionId', function(req, res, next) {
	// TODO: apply for audition when user is logged in
	Audition.findById(req.params.auditionId)
		.then(function (audition) {
			if (!audition) {
				// no such audition exists
				res.status(404).send("Sorry, we can't find an audition by that id.");
			}

			Show.findById(audition.show_id)
				.then(function(show) {
					Company.findById(show.company_id)
						.then(function(company) {

						AttendingShow.findAll({
							where: {
								show_id: show.id,
								role_desc: 'creative'
							}
						}).then(function(attendingShows) {
							console.log(attendingShows);

							// If user is logged in, check if they are a showOwner
							// If isShowOwner = true, user can edit audition
							var isShowOwner = false;
							if (req.user) {
								User.findById(req.user.id)
								.then(function(user) {
									if (user.role == show.company_id) {
										isShowOwner = true;
									}
								}).catch(function(err) {
									console.log(err);
								});
							}

							var creative = [];
							
							if (Object.keys(attendingShows).length == 0) {
								// nobody is attending as a creative

								// Get show venue from Google Places
								googleMapsClient.place({
									placeid: show.venue
								}).asPromise()
								.then(function(googleShow){
									// Get audition venue from Google Places
									googleMapsClient.place({
										placeid: audition.venue
									}).asPromise()
									.then(function(googleAudition) {
										// Show venue is a Google Maps place_id
										// Audition venue is a Google Maps place_dd
										console.log('Both show venue and audition venue are Google Place Id.');
										res.render('audition.ejs', {
											'audition': audition,
											'show': show,
											'company': company,
											'creative': creative,
											'showIsValidGoogleMap': true,
											'showVenue': googleShow.json.result.name,
											'auditionIsValidGoogleMap': true,
											'auditionVenue': googleAudition.json.result.name,
											'isShowOwner': isShowOwner
										});	
									}).catch(function(err) {
										// Show venue is a Google Maps place_id
										// Audition venue is not a Google Maps place_id
										console.log('Show venue is a Google Place Id. Audition venue is not a Google Place Id.');
										res.render('audition.ejs', {
											'audition': audition,
											'show': show,
											'company': company,
											'creative': creative,
											'showIsValidGoogleMap': true,
											'showVenue': googleShow.json.result.name,
											'auditionIsValidGoogleMap': false,
											'auditionVenue': audition.venue,
											'isShowOwner': isShowOwner
										});	
									});
									
								}).catch(function(err) {
									// Get audition venue from Google Places
									googleMapsClient.place({
										placeid: audition.venue
									}).asPromise()
									.then(function(googleAudition) {
										// Show venue is not a Google Maps place_id
										// Audition venue is a Google Maps place_dd
										console.log('Both show venue and audition venue are Google Place Id.');
										res.render('audition.ejs', {
											'audition': audition,
											'show': show,
											'company': company,
											'creative': creative,
											'showIsValidGoogleMap': false,
											'showVenue': show.venue,
											'auditionIsValidGoogleMap': true,
											'auditionVenue': googleAudition.json.result.name,
											'isShowOwner': isShowOwner
										});	
									}).catch(function(err) {
										// Show venue is not a Google Maps place_id
										// Audition venue is not a Google Maps place_id
										console.log('Show venue is a Google Place Id. Audition venue is not a Google Place Id.');
										res.render('audition.ejs', {
											'audition': audition,
											'show': show,
											'company': company,
											'creative': creative,
											'showIsValidGoogleMap': false,
											'showVenue': show.venue,
											'auditionIsValidGoogleMap': false,
											'auditionVenue': audition.venue,
											'isShowOwner': isShowOwner
										});	
									});
									
								});
							} else {
								// Case: At least 1 person is attending the audition's show as a Creative
								var completedRequests = 0;

								for (let i = 0; i < Object.keys(attendingShows).length; i++) {
									LocalUser.findById(attendingShows[i].user_id)
										.then(function(localuser) {
											if (localuser) {
												completedRequests++;
												creative.push(localuser);
											} else {
												// no such local user exists
												FacebookUser.findById(attendingShows[i].user_id)
													.then(function(fbuser) {
														if (fbuser) {
															completedRequests++;
															creative.push(localuser);
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
											.then(function(googleShow){
												googleMapsClient.place({
													placeid: audition.venue
												}).asPromise()
												.then(function(googleAudition) {
													// Show venue is a Google Maps place_id
													// Audition venue is a Google Maps place_id
													res.render('audition.ejs', {
														'audition': audition,
														'show': show,
														'companyName': company.name,
														'creative': creative,
														'showIsValidGoogleMap': true,
														'showVenue': googleShow.json.result.name,
														'auditionIsValidGoogleMap': true,
														'auditionVenue': googleAudition.json.result.name,
														'isShowOwner': isShowOwner
													});	
												}).catch(function(err) {
													// Show venue is a Google Maps place_id
													// Audition venue is not a Google Maps place_id
													res.render('audition.ejs', {
														'audition': audition,
														'show': show,
														'companyName': company.name,
														'creative': creative,
														'showIsValidGoogleMap': true,
														'showVenue': googleShow.json.result.name,
														'auditionIsValidGoogleMap': false,
														'auditionVenue': audition.venue,
														'isShowOwner': isShowOwner
													});														
												});
											}).catch(function(err) {
												googleMapsClient.place({
													placeid: audition.venue
												}).asPromise()
												.then(function(googleAudition) {
													// Show venue is not a Google Maps place_id
													// Audition venue is a Google Maps place_id
													res.render('audition.ejs', {
														'audition': audition,
														'show': show,
														'companyName': company.name,
														'creative': creative,
														'showIsValidGoogleMap': false,
														'showVenue': show.venue,
														'auditionIsValidGoogleMap': true,
														'auditionVenue': googleAudition.json.result.name,
														'isShowOwner': isShowOwner
													});	
												}).catch(function(err) {
													// Show venue is not a Google Maps place_id
													// Audition venue is not a Google Maps place_id
													res.render('audition.ejs', {
														'audition': audition,
														'show': show,
														'companyName': company.name,
														'creative': creative,
														'showIsValidGoogleMap': false,
														'showVenue': show.venue,
														'auditionIsValidGoogleMap': false,
														'auditionVenue': audition.venue,
														'isShowOwner': isShowOwner
													});														
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
					})

				}).catch(function(err) {
					console.log(err);
				});
		}).catch(function (err) {
			// invalid input format
			res.status(404).send("Sorry, we can't find an audition by that id.");
			console.log(err);
		});
});

router.get('/editaudition/:auditionId', authorize.loggedIn('/auditions'), authorize.showOwner('/auditions'), function(req, res, next) {
	Audition.findById(req.params.auditionId)
	.then(function(audition) {
		googleMapsClient.place({
			placeid: audition.venue
		}).asPromise()
		.then(function(response) {
			// audition.venue is a place id
			Show.findById(audition.show_id)
			.then(function(show) {
				res.render('editAudition.ejs', {
					audition: audition,
					venue: response.json.result.name,
					showTitle: show.title
				});
			}).catch(function(err) {
				console.log(err);
			})
		}).catch(function(err) {
			// audition.venue is not a place id
			Show.findById(audition.show_id)
			.then(function(show) {
				res.render('editAudition.ejs', {
					audition: audition,
					venue: audition.venue,
					showTitle: show.title
				});			
			}).catch(function(err) {
				console.log(err);
			});
		});
	}).catch(function(err) {
		console.log(err);
		res.status(404).send("Sorry, something went wrong with your request");
	});
});


router.post('/editaudition', authorize.loggedIn('/auditions'), authorize.showOwner('/auditions'), function(req, res, next) {
	var data = Object.values(req.body);

	if (typeof data[1] == "string") {
		data[2] = [data[2]];
	}

	if (typeof data[3] == "string") {
		data[3] = [data[3]];
	}
	Audition.update({
		venue: req.body.venue,
		contact: data[1],
		notes: req.body.notes,
		date: data[3]
	}, {
		where: {id: req.body.audition_id},
		returning: true,
		plain: true
	}).then(function(audition) {
		audition = audition[1];
		return res.send(audition);
	}).catch(function(err) {
		console.log(err);
		res.status(404).send("Sorry, something went wrong with your request");
	});
});


module.exports = router;
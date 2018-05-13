const express = require('express');
const router = express.Router();
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

var passport = require('../middleware/passport');

var Show = require('../../models/').Show;
var FacebookUser = require('../../models/').FacebookUser;
var LocalUser = require('../../models/').LocalUser;
var Company = require('../../models/').Company;

var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyCqD0RPTp6wV2-Qr2N3LPYLeK9_8qZt1wI',
  Promise: Promise
});

router.get('/', function(req, res) {
	if (req.user) {
		res.redirect('/shows');
	} else {
		res.render('index.ejs');
	}
});

router.get('/faq', function(req, res, next) {
	res.render('FAQ.ejs');
});

router.get('/aboutUs', function(req, res, next) {
	res.render('aboutUs.ejs');
});

router.get('/contactUs', function(req, res, next) {
	res.render('contactUs.ejs');
});

router.get('/searchUrl/:param', function(req, res, next) {
	if (req.user) {
		var data = {};
		data["suggests"] = {};
		data["suggests"]["Shows"] = [];
		data["suggests"]["Users"] = [];
		data["suggests"]["Venues"] = [];
		data["suggests"]["Companies"] = [];

		Show.findAll({
			attributes: ['id', 'title', 'picture'],
			where: {
				'title': {
					[Op.iLike]: '%' + req.params.param + '%'
				}
			},
			limit: 5
		}).then(function(shows) {
			var completedRequest1 = 0;

			if (Object.keys(shows).length == 0) {
				// do next
				FacebookUser.findAll({
					attributes: ['id', 'name', 'profile_picture'],
					where: {
						'name' : {
							[Op.iLike]: '%' + req.params.param + '%'
						}
					},
					limit: 2
				}).then(function(fbusers) {
					var completedRequest2 = 0;

					/* Start FB Users if statement */
					if (Object.keys(fbusers).length == 0) {
						LocalUser.findAll({
							attributes: ['id', 'name', 'profile_picture'],
							where: {
								'name': {
									[Op.iLike]: '%' + req.params.param + '%'
								}
							}, 
							limit: 2
						}).then(function(localusers) {
							var completedRequest3 = 0;

							/* Start Local Users if statement */
							if (Object.keys(localusers).length == 0) {
								Company.findAll({
									attributes: ['id', 'name'],
									where: {
										'name': {
											[Op.iLike]: '%' + req.params.param + '%'
										}
									},
									limit: 5
								}).then(function(companies) {
									var completedRequest4 = 0;

									/* Start Companies if statement */
									if (Object.keys(companies).length == 0) {
										googleMapsClient.placesAutoComplete({
											input: req.params.param,
											//types: ['geocode', 'establishment']
										}).asPromise()
										.then(function(response) {
											var completedRequest5 = 0;

											/* Start Google Maps if statement */
											if (response.json.predictions.length == 0) {
												return res.send(data);
											}
											/* End Google Maps if statement */

											for (let m = 0; m < response.json.predictions.length; m++) {
												var datum = {};
												datum["name"] = response.json.predictions[m].description;
												// datum["image"] = 
												datum["link"] = '/venues/' + response.json.predictions[m].place_id;
												data["suggests"]["Venues"].push(datum);
												completedRequest5++;

												if (completedRequest5 == response.json.predictions.length) {
													console.log('data: ' + data);
													return res.send(data);
												}
											}
										}).catch(function(err) {
											console.log(err);
											res.status(404).send("Sorry, something went wrong with your request.");
										});
										/* End Google Maps*/
									
									}
									/* End Companies if statement*/

									/* Start Companies for loop*/
									for (let l = 0; l < Object.keys(companies).length; l++) {
										var datum = {};
										datum["name"] = companies[l].name;
										// datum["image"] = 
										datum["link"] = '/companies/' + companies[l].id;
										data["suggests"]["Companies"].push(datum);
										completedRequest4++;

										if (completedRequest4 == Object.keys(companies).length) {
											// do next
											googleMapsClient.placesAutoComplete({
												input: req.params.param,
												//types: ['geocode', 'establishment']
											}).asPromise()
											.then(function(response) {
												var completedRequest5 = 0;

												/* Start Google Maps if statement */
												if (response.json.predictions.length == 0) {
													return res.send(data);
												}
												/* End Google Maps if statement */

												for (let m = 0; m < response.json.predictions.length; m++) {
													var datum = {};
													datum["name"] = response.json.predictions[m].description;
													// datum["image"] = 
													datum["link"] = '/venues/' + response.json.predictions[m].place_id;
													data["suggests"]["Venues"].push(datum);
													completedRequest5++;

													if (completedRequest5 == response.json.predictions.length) {
														console.log('data: ' + data);
														return res.send(data);
													}
												}
											}).catch(function(err) {
												console.log(err);
												res.status(404).send("Sorry, something went wrong with your request.");
											});
										}
									}
									/* End Companies for loop */

								}).catch(function(err) {
									console.log(err);
									res.status(404).send("Sorry, something went wrong with your request.");
								});
								/* End Companies*/
							}
							/* End Local Users if statement*/

							/* Start Local Users for loop*/
							for (let k = 0; k < Object.keys(localusers).length; k++) {
								var datum = {};
								datum["name"] = localusers[k].name
								datum["image"] = '/static' + localusers[k].profile_picture;
								datum["link"] = '/users/' + localusers[k].id;
								data["suggests"]["Users"].push(datum);
								completedRequest3++;

								if (completedRequest3 == Object.keys(localusers).length) {
									// do next
									Company.findAll({
										attributes: ['id', 'name'],
										where: {
											'name': {
												[Op.iLike]: '%' + req.params.param + '%'
											}
										},
										limit: 5
									}).then(function(companies) {
										var completedRequest4 = 0;

										/* Start Companies if statement */
										if (Object.keys(companies).length == 0) {
											googleMapsClient.placesAutoComplete({
												input: req.params.param,
												//types: ['geocode', 'establishment']
											}).asPromise()
											.then(function(response) {
												var completedRequest5 = 0;

												/* Start Google Maps if statement */
												if (response.json.predictions.length == 0) {
													return res.send(data);
												}
												/* End Google Maps if statement */

												/* Start Google Maps for loop */
												for (let m = 0; m < response.json.predictions.length; m++) {
													var datum = {};
													datum["name"] = response.json.predictions[m].description;
													// datum["image"] = 
													datum["link"] = '/venues/' + response.json.predictions[m].place_id;
													data["suggests"]["Venues"].push(datum);
													completedRequest5++;

													if (completedRequest5 == response.json.predictions.length) {
														console.log('data: ' + data);
														return res.send(data);
													}
													/* End Google Maps complete request if statement */
												}
												/* End Google Maps for loop */
											}).catch(function(err) {
												console.log(err);
												res.status(404).send("Sorry, something went wrong with your request.");
											});
											/* End Google Maps*/
										
										}
										/* End Companies if statement*/

										/* Start Companies for loop*/
										for (let l = 0; l < Object.keys(companies).length; l++) {
											var datum = {};
											datum["name"] = companies[l].name;
											// datum["image"] = 
											datum["link"] = '/companies/' + companies[l].id;
											data["suggests"]["Companies"].push(datum);
											completedRequest4++;

											if (completedRequest4 == Object.keys(companies).length) {
												// do next
												googleMapsClient.placesAutoComplete({
													input: req.params.param,
													//types: ['geocode', 'establishment']
												}).asPromise()
												.then(function(response) {
													var completedRequest5 = 0;

													/* Start Google Maps if statement */
													if (response.json.predictions.length == 0) {
														return res.send(data);
													}
													/* End Google Maps if statement */

													for (let m = 0; m < response.json.predictions.length; m++) {
														var datum = {};
														datum["name"] = response.json.predictions[m].description;
														// datum["image"] = 
														datum["link"] = '/venues/' + response.json.predictions[m].place_id;
														data["suggests"]["Venues"].push(datum);
														completedRequest5++;

														if (completedRequest5 == response.json.predictions.length) {
															console.log('data: ' + data);
															return res.send(data);
														}
														/* End Google Maps complete request if statement */
													}
													/* End Google Maps for loop */
												}).catch(function(err) {
													console.log(err);
													res.status(404).send("Sorry, something went wrong with your request.");
												});
												/* End Google Maps*/
											}
											/* End Companies complete request if statement */
										}
										/* End Companies for loop */

									}).catch(function(err) {
										console.log(err);
										res.status(404).send("Sorry, something went wrong with your request.");
									});
									/* End Companies*/
								}
								/* End Local User complete request if statement*/
							}
							/* End Local User for loop */
						}).catch(function(err) {
							console.log(err);
							res.status(404).send("Sorry, something went wrong with your request.");
						});
						/* End Local User */
					}
					/* End FB User if statement */

					/* Start FB User for loop*/
					for (let j = 0; j < Object.keys(fbusers).length; j++) {
						var datum = {};
						datum["name"] = fbusers[j].name;
						datum["image"] = fbusers[j].profile_picture;
						datum["link"] = '/users/' + fbusers[j].id;
						data["suggests"]["Users"].push(datum);
						completedRequest2++;

						/* Start FB User completed request if statement */
						if (completedRequest2 == Object.keys(fbusers).length) {
							LocalUser.findAll({
								attributes: ['id', 'name', 'profile_picture'],
								where: {
									'name': {
										[Op.iLike]: '%' + req.params.param + '%'
									}
								}, 
								limit: 2
							}).then(function(localusers) {
								var completedRequest3 = 0;

								/* Start Local Users if statement */
								if (Object.keys(localusers).length == 0) {
									Company.findAll({
										attributes: ['id', 'name'],
										where: {
											'name': {
												[Op.iLike]: '%' + req.params.param + '%'
											}
										},
										limit: 5
									}).then(function(companies) {
										var completedRequest4 = 0;

										/* Start Companies if statement */
										if (Object.keys(companies).length == 0) {
											googleMapsClient.placesAutoComplete({
												input: req.params.param,
												//types: ['geocode', 'establishment']
											}).asPromise()
											.then(function(response) {
												var completedRequest5 = 0;

												/* Start Google Maps if statement */
												if (response.json.predictions.length == 0) {
													return res.send(data);
												}
												/* End Google Maps if statement */

												for (let m = 0; m < response.json.predictions.length; m++) {
													var datum = {};
													datum["name"] = response.json.predictions[m].description;
													// datum["image"] = 
													datum["link"] = '/venues/' + response.json.predictions[m].place_id;
													data["suggests"]["Venues"].push(datum);
													completedRequest5++;

													if (completedRequest5 == response.json.predictions.length) {
														console.log('data: ' + data);
														return res.send(data);
													}
												}
											}).catch(function(err) {
												console.log(err);
												res.status(404).send("Sorry, something went wrong with your request.");
											});
											/* End Google Maps*/
										
										}
										/* End Companies if statement*/

										/* Start Companies for loop*/
										for (let l = 0; l < Object.keys(companies).length; l++) {
											var datum = {};
											datum["name"] = companies[l].name;
											// datum["image"] = 
											datum["link"] = '/companies/' + companies[l].id;
											data["suggests"]["Companies"].push(datum);
											completedRequest4++;

											if (completedRequest4 == Object.keys(companies).length) {
												// do next
												googleMapsClient.placesAutoComplete({
													input: req.params.param,
													//types: ['geocode', 'establishment']
												}).asPromise()
												.then(function(response) {
													var completedRequest5 = 0;

													/* Start Google Maps if statement */
													if (response.json.predictions.length == 0) {
														return res.send(data);
													}
													/* End Google Maps if statement */

													for (let m = 0; m < response.json.predictions.length; m++) {
														var datum = {};
														datum["name"] = response.json.predictions[m].description;
														// datum["image"] = 
														datum["link"] = '/venues/' + response.json.predictions[m].place_id;
														data["suggests"]["Venues"].push(datum);
														completedRequest5++;

														if (completedRequest5 == response.json.predictions.length) {
															console.log('data: ' + data);
															return res.send(data);
														}
													}
												}).catch(function(err) {
													console.log(err);
													res.status(404).send("Sorry, something went wrong with your request.");
												});
											}
										}
										/* End Companies for loop */

									}).catch(function(err) {
										console.log(err);
										res.status(404).send("Sorry, something went wrong with your request.");
									});
									/* End Companies*/
								}
								/* End Local Users if statement*/

								/* Start Local Users for loop*/
								for (let k = 0; k < Object.keys(localusers).length; k++) {
									var datum = {};
									datum["name"] = localusers[k].name
									datum["image"] = '/static' + localusers[k].profile_picture;
									datum["link"] = '/users/' + localusers[k].id;
									data["suggests"]["Users"].push(datum);
									completedRequest3++;

									if (completedRequest3 == Object.keys(localusers).length) {
										// do next
										Company.findAll({
											attributes: ['id', 'name'],
											where: {
												'name': {
												[Op.iLike]: '%' + req.params.param + '%'
												}
											},
											limit: 5
										}).then(function(companies) {
											var completedRequest4 = 0;

											/* Start Companies if statement */
											if (Object.keys(companies).length == 0) {
												googleMapsClient.placesAutoComplete({
													input: req.params.param,
													//types: ['geocode', 'establishment']
												}).asPromise()
												.then(function(response) {
													var completedRequest5 = 0;

													/* Start Google Maps if statement */
													if (response.json.predictions.length == 0) {
														return res.send(data);
													}
													/* End Google Maps if statement */

													/* Start Google Maps for loop */
													for (let m = 0; m < response.json.predictions.length; m++) {
														var datum = {};
														datum["name"] = response.json.predictions[m].description;
														// datum["image"] = 
														datum["link"] = '/venues/' + response.json.predictions[m].place_id;
														data["suggests"]["Venues"].push(datum);
														completedRequest5++;

														if (completedRequest5 == response.json.predictions.length) {
															console.log('data: ' + data);
															return res.send(data);
														}
														/* End Google Maps complete request if statement */
													}
													/* End Google Maps for loop */
												}).catch(function(err) {
													console.log(err);
													res.status(404).send("Sorry, something went wrong with your request.");
												});
												/* End Google Maps*/
											
											}
											/* End Companies if statement*/

											/* Start Companies for loop*/
											for (let l = 0; l < Object.keys(companies).length; l++) {
												var datum = {};
												datum["name"] = companies[l].name;
												// datum["image"] = 
												datum["link"] = '/companies/' + companies[l].id;
												data["suggests"]["Companies"].push(datum);
												completedRequest4++;

												if (completedRequest4 == Object.keys(companies).length) {
													// do next
													googleMapsClient.placesAutoComplete({
														input: req.params.param,
														//types: ['geocode', 'establishment']
													}).asPromise()
													.then(function(response) {
														var completedRequest5 = 0;

														/* Start Google Maps if statement */
														if (response.json.predictions.length == 0) {
															return res.send(data);
														}
														/* End Google Maps if statement */

														for (let m = 0; m < response.json.predictions.length; m++) {
															var datum = {};
															datum["name"] = response.json.predictions[m].description;
															// datum["image"] = 
															datum["link"] = '/venues/' + response.json.predictions[m].place_id;
															data["suggests"]["Venues"].push(datum);
															completedRequest5++;

															if (completedRequest5 == response.json.predictions.length) {
																console.log('data: ' + data);
																return res.send(data);
															}
															/* End Google Maps complete request if statement */
														}
														/* End Google Maps for loop */
													}).catch(function(err) {
														console.log(err);
														res.status(404).send("Sorry, something went wrong with your request.");
													});
													/* End Google Maps*/
												}
												/* End Companies complete request if statement */
											}
											/* End Companies for loop */

										}).catch(function(err) {
											console.log(err);
											res.status(404).send("Sorry, something went wrong with your request.");
										});
										/* End Companies*/
									}
									/* End Local User complete request if statement*/
								}
								/* End Local User for loop */
							}).catch(function(err) {
								console.log(err);
								res.status(404).send("Sorry, something went wrong with your request.");
							});
						/* End Local User */
						}
						/* End FB User complete request if statement */
					}
					/* End FB User for loop */
				}).catch(function(err) {
					console.log(err);
					res.status(404).send("Sorry, something went wrong with your request.");
				});
				/* End FB User*/
			}
			/* End Shows if statement */

			/* Start Shows for loop */
			for (let i = 0; i < Object.keys(shows).length; i++) {
				var datum = {};
				datum["name"] = shows[i].title;
				datum["image"] = '/static' + shows[i].picture;
				datum["link"] = '/shows/' + shows[i].id;
				data["suggests"]["Shows"].push(datum);
				completedRequest1++;

				/* Start Shows complete request if statement */
				if (completedRequest1 == Object.keys(shows).length) {
					FacebookUser.findAll({
						attributes: ['id', 'name', 'profile_picture'],
						where: {
							'name': {
								[Op.iLike]: '%' + req.params.param + '%'
							}
						},
						limit: 2
					}).then(function(fbusers) {
						var completedRequest2 = 0;

						/* Start FB Users if statement */
						if (Object.keys(fbusers).length == 0) {
							LocalUser.findAll({
								attributes: ['id', 'name', 'profile_picture'],
								where: {
									'name': {
										[Op.iLike]: '%' + req.params.param + '%'
									}
								}, 
								limit: 2
							}).then(function(localusers) {
								var completedRequest3 = 0;

								/* Start Local Users if statement */
								if (Object.keys(localusers).length == 0) {
									Company.findAll({
										attributes: ['id', 'name'],
										where: {
											'name': {
												[Op.iLike]: '%' + req.params.param + '%'
											}
										},
										limit: 5
									}).then(function(companies) {
										var completedRequest4 = 0;

										/* Start Companies if statement */
										if (Object.keys(companies).length == 0) {
											googleMapsClient.placesAutoComplete({
												input: req.params.param,
												//types: ['geocode', 'establishment']
											}).asPromise()
											.then(function(response) {
												var completedRequest5 = 0;

												/* Start Google Maps if statement */
												if (response.json.predictions.length == 0) {
													return res.send(data);
												}
												/* End Google Maps if statement */

												for (let m = 0; m < response.json.predictions.length; m++) {
													var datum = {};
													datum["name"] = response.json.predictions[m].description;
													// datum["image"] = 
													datum["link"] = '/venues/' + response.json.predictions[m].place_id;
													data["suggests"]["Venues"].push(datum);
													completedRequest5++;

													if (completedRequest5 == response.json.predictions.length) {
														console.log('data: ' + data);
														return res.send(data);
													}
												}
											}).catch(function(err) {
												console.log(err);
												res.status(404).send("Sorry, something went wrong with your request.");
											});
											/* End Google Maps*/
										
										}
										/* End Companies if statement*/

										/* Start Companies for loop*/
										for (let l = 0; l < Object.keys(companies).length; l++) {
											var datum = {};
											datum["name"] = companies[l].name;
											// datum["image"] = 
											datum["link"] = '/companies/' + companies[l].id;
											data["suggests"]["Companies"].push(datum);
											completedRequest4++;

											if (completedRequest4 == Object.keys(companies).length) {
												// do next
												googleMapsClient.placesAutoComplete({
													input: req.params.param,
													//types: ['geocode', 'establishment']
												}).asPromise()
												.then(function(response) {
													var completedRequest5 = 0;

													/* Start Google Maps if statement */
													if (response.json.predictions.length == 0) {
														return res.send(data);
													}
													/* End Google Maps if statement */

													for (let m = 0; m < response.json.predictions.length; m++) {
														var datum = {};
														datum["name"] = response.json.predictions[m].description;
														// datum["image"] = 
														datum["link"] = '/venues/' + response.json.predictions[m].place_id;
														data["suggests"]["Venues"].push(datum);
														completedRequest5++;

														if (completedRequest5 == response.json.predictions.length) {
															console.log('data: ' + data);
															return res.send(data);
														}
													}
												}).catch(function(err) {
													console.log(err);
													res.status(404).send("Sorry, something went wrong with your request.");
												});
											}
										}
										/* End Companies for loop */

									}).catch(function(err) {
										console.log(err);
										res.status(404).send("Sorry, something went wrong with your request.");
									});
									/* End Companies*/
								}
								/* End Local Users if statement*/

								/* Start Local Users for loop*/
								for (let k = 0; k < Object.keys(localusers).length; k++) {
									var datum = {};
									datum["name"] = localusers[k].name
									datum["image"] = '/static' + localusers[k].profile_picture;
									datum["link"] = '/users/' + localusers[k].id;
									data["suggests"]["Users"].push(datum);
									completedRequest3++;

									if (completedRequest3 == Object.keys(localusers).length) {
										// do next
										Company.findAll({
											attributes: ['id', 'name'],
											where: {
												'name': {
													[Op.iLike]: '%' + req.params.param + '%'
												}
											},
											limit: 5
										}).then(function(companies) {
											var completedRequest4 = 0;

											/* Start Companies if statement */
											if (Object.keys(companies).length == 0) {
												googleMapsClient.placesAutoComplete({
													input: req.params.param,
													//types: ['geocode', 'establishment']
												}).asPromise()
												.then(function(response) {
													var completedRequest5 = 0;

													/* Start Google Maps if statement */
													if (response.json.predictions.length == 0) {
														return res.send(data);
													}
													/* End Google Maps if statement */

													/* Start Google Maps for loop */
													for (let m = 0; m < response.json.predictions.length; m++) {
														var datum = {};
														datum["name"] = response.json.predictions[m].description;
														// datum["image"] = 
														datum["link"] = '/venues/' + response.json.predictions[m].place_id;
														data["suggests"]["Venues"].push(datum);
														completedRequest5++;

														if (completedRequest5 == response.json.predictions.length) {
															console.log('data: ' + data);
															return res.send(data);
														}
														/* End Google Maps complete request if statement */
													}
													/* End Google Maps for loop */
												}).catch(function(err) {
													console.log(err);
													res.status(404).send("Sorry, something went wrong with your request.");
												});
												/* End Google Maps*/
											
											}
											/* End Companies if statement*/

											/* Start Companies for loop*/
											for (let l = 0; l < Object.keys(companies).length; l++) {
												var datum = {};
												datum["name"] = companies[l].name;
												// datum["image"] = 
												datum["link"] = '/companies/' + companies[l].id;
												data["suggests"]["Companies"].push(datum);
												completedRequest4++;

												if (completedRequest4 == Object.keys(companies).length) {
													// do next
													googleMapsClient.placesAutoComplete({
														input: req.params.param,
														//types: ['geocode', 'establishment']
													}).asPromise()
													.then(function(response) {
														var completedRequest5 = 0;

														/* Start Google Maps if statement */
														if (response.json.predictions.length == 0) {
															return res.send(data);
														}
														/* End Google Maps if statement */

														for (let m = 0; m < response.json.predictions.length; m++) {
															var datum = {};
															datum["name"] = response.json.predictions[m].description;
															// datum["image"] = 
															datum["link"] = '/venues/' + response.json.predictions[m].place_id;
															data["suggests"]["Venues"].push(datum);
															completedRequest5++;

															if (completedRequest5 == response.json.predictions.length) {
																console.log('data: ' + data);
																return res.send(data);
															}
															/* End Google Maps complete request if statement */
														}
														/* End Google Maps for loop */
													}).catch(function(err) {
														console.log(err);
														res.status(404).send("Sorry, something went wrong with your request.");
													});
													/* End Google Maps*/
												}
												/* End Companies complete request if statement */
											}
											/* End Companies for loop */

										}).catch(function(err) {
											console.log(err);
											res.status(404).send("Sorry, something went wrong with your request.");
										});
										/* End Companies*/
									}
									/* End Local User complete request if statement*/
								}
								/* End Local User for loop */
							}).catch(function(err) {
								console.log(err);
								res.status(404).send("Sorry, something went wrong with your request.");
							});
							/* End Local User */
						}
						/* End FB User if statement */

						/* Start FB User for loop*/
						for (let j = 0; j < Object.keys(fbusers).length; j++) {
							var datum = {};
							datum["name"] = fbusers[j].name;
							datum["image"] = fbusers[j].profile_picture;
							datum["link"] = '/users/' + fbusers[j].id;
							data["suggests"]["Users"].push(datum);
							completedRequest2++;

							/* Start FB User completed request if statement */
							if (completedRequest2 == Object.keys(fbusers).length) {
								LocalUser.findAll({
									attributes: ['id', 'name', 'profile_picture'],
									where: {
										'name': {
											[Op.iLike]: '%' + req.params.param + '%'
										}
									}, 
									limit: 2
								}).then(function(localusers) {
									var completedRequest3 = 0;

									/* Start Local Users if statement */
									if (Object.keys(localusers).length == 0) {
										Company.findAll({
											attributes: ['id', 'name'],
											where: {
												'name': {
													[Op.iLike]: '%' + req.params.param + '%'
												}
											},
											limit: 5
										}).then(function(companies) {
											var completedRequest4 = 0;

											/* Start Companies if statement */
											if (Object.keys(companies).length == 0) {
												googleMapsClient.placesAutoComplete({
													input: req.params.param,
													//types: ['geocode', 'establishment']
												}).asPromise()
												.then(function(response) {
													var completedRequest5 = 0;

													/* Start Google Maps if statement */
													if (response.json.predictions.length == 0) {
														return res.send(data);
													}
													/* End Google Maps if statement */

													for (let m = 0; m < response.json.predictions.length; m++) {
														var datum = {};
														datum["name"] = response.json.predictions[m].description;
														// datum["image"] = 
														datum["link"] = '/venues/' + response.json.predictions[m].place_id;
														data["suggests"]["Venues"].push(datum);
														completedRequest5++;

														if (completedRequest5 == response.json.predictions.length) {
															console.log('data: ' + data);
															return res.send(data);
														}
													}
												}).catch(function(err) {
													console.log(err);
													res.status(404).send("Sorry, something went wrong with your request.");
												});
												/* End Google Maps*/
											
											}
											/* End Companies if statement*/

											/* Start Companies for loop*/
											for (let l = 0; l < Object.keys(companies).length; l++) {
												var datum = {};
												datum["name"] = companies[l].name;
												// datum["image"] = 
												datum["link"] = '/companies/' + companies[l].id;
												data["suggests"]["Companies"].push(datum);
												completedRequest4++;

												if (completedRequest4 == Object.keys(companies).length) {
													// do next
													googleMapsClient.placesAutoComplete({
														input: req.params.param,
														//types: ['geocode', 'establishment']
													}).asPromise()
													.then(function(response) {
														var completedRequest5 = 0;

														/* Start Google Maps if statement */
														if (response.json.predictions.length == 0) {
															return res.send(data);
														}
														/* End Google Maps if statement */

														for (let m = 0; m < response.json.predictions.length; m++) {
															var datum = {};
															datum["name"] = response.json.predictions[m].description;
															// datum["image"] = 
															datum["link"] = '/venues/' + response.json.predictions[m].place_id;
															data["suggests"]["Venues"].push(datum);
															completedRequest5++;

															if (completedRequest5 == response.json.predictions.length) {
																console.log('data: ' + data);
																return res.send(data);
															}
														}
													}).catch(function(err) {
														console.log(err);
														res.status(404).send("Sorry, something went wrong with your request.");
													});
												}
											}
											/* End Companies for loop */

										}).catch(function(err) {
											console.log(err);
											res.status(404).send("Sorry, something went wrong with your request.");
										});
										/* End Companies*/
									}
									/* End Local Users if statement*/

									/* Start Local Users for loop*/
									for (let k = 0; k < Object.keys(localusers).length; k++) {
										var datum = {};
										datum["name"] = localusers[k].name
										datum["image"] = '/static' + localusers[k].profile_picture;
										datum["link"] = '/users/' + localusers[k].id;
										data["suggests"]["Users"].push(datum);
										completedRequest3++;

										if (completedRequest3 == Object.keys(localusers).length) {
											// do next
											Company.findAll({
												attributes: ['id', 'name'],
												where: {
													'name': {
														[Op.iLike]: '%' + req.params.param + '%'
													}
												},
												limit: 5
											}).then(function(companies) {
												var completedRequest4 = 0;

												/* Start Companies if statement */
												if (Object.keys(companies).length == 0) {
													googleMapsClient.placesAutoComplete({
														input: req.params.param,
														//types: ['geocode', 'establishment']
													}).asPromise()
													.then(function(response) {
														var completedRequest5 = 0;

														/* Start Google Maps if statement */
														if (response.json.predictions.length == 0) {
															return res.send(data);
														}
														/* End Google Maps if statement */

														/* Start Google Maps for loop */
														for (let m = 0; m < response.json.predictions.length; m++) {
															var datum = {};
															datum["name"] = response.json.predictions[m].description;
															// datum["image"] = 
															datum["link"] = '/venues/' + response.json.predictions[m].place_id;
															data["suggests"]["Venues"].push(datum);
															completedRequest5++;

															if (completedRequest5 == response.json.predictions.length) {
																console.log('data: ' + data);
																return res.send(data);
															}
															/* End Google Maps complete request if statement */
														}
														/* End Google Maps for loop */
													}).catch(function(err) {
														console.log(err);
														res.status(404).send("Sorry, something went wrong with your request.");
													});
													/* End Google Maps*/
												
												}
												/* End Companies if statement*/

												/* Start Companies for loop*/
												for (let l = 0; l < Object.keys(companies).length; l++) {
													var datum = {};
													datum["name"] = companies[l].name;
													// datum["image"] = 
													datum["link"] = '/companies/' + companies[l].id;
													data["suggests"]["Companies"].push(datum);
													completedRequest4++;

													if (completedRequest4 == Object.keys(companies).length) {
														// do next
														googleMapsClient.placesAutoComplete({
															input: req.params.param,
															//types: ['geocode', 'establishment']
														}).asPromise()
														.then(function(response) {
															var completedRequest5 = 0;

															/* Start Google Maps if statement */
															if (response.json.predictions.length == 0) {
																return res.send(data);
															}
															/* End Google Maps if statement */

															for (let m = 0; m < response.json.predictions.length; m++) {
																var datum = {};
																datum["name"] = response.json.predictions[m].description;
																// datum["image"] = 
																datum["link"] = '/venues/' + response.json.predictions[m].place_id;
																data["suggests"]["Venues"].push(datum);
																completedRequest5++;

																if (completedRequest5 == response.json.predictions.length) {
																	console.log('data: ' + data);
																	return res.send(data);
																}
																/* End Google Maps complete request if statement */
															}
															/* End Google Maps for loop */
														}).catch(function(err) {
															console.log(err);
															res.status(404).send("Sorry, something went wrong with your request.");
														});
														/* End Google Maps*/
													}
													/* End Companies complete request if statement */
												}
												/* End Companies for loop */

											}).catch(function(err) {
												console.log(err);
												res.status(404).send("Sorry, something went wrong with your request.");
											});
											/* End Companies*/
										}
										/* End Local User complete request if statement*/
									}
									/* End Local User for loop */
								}).catch(function(err) {
									console.log(err);
									res.status(404).send("Sorry, something went wrong with your request.");
								});
							/* End Local User */
							}
							/* End FB User complete request if statement */
						}
						/* End FB User for loop */
					}).catch(function(err) {
						console.log(err);
						res.status(404).send("Sorry, something went wrong with your request.");
					});
					/* End FB User*/
				}
				/* End Shows complete request if statement */
			}
			/* End Shows for loop */
		}).catch(function(err) {
			console.log(err);
			res.status(404).send("Sorry, something went wrong with your request.");
		});
		/* End Shows */
		
	} else {
		var data = {};
		data["suggests"] = {};
		data["suggests"]["Shows"] = [];
		data["suggests"]["Venues"] = [];
		data["suggests"]["Companies"] = [];

		Show.findAll({
			attributes: ['id', 'title', 'picture'],
			where: {
				'title': {
					[Op.iLike]: '%' + req.params.param + '%'
				}
			},
			limit: 5
		}).then(function(shows) {
			var completedRequest1 = 0;

			if (Object.keys(shows).length == 0) {
				// do next
				Company.findAll({
					attributes: ['id', 'name'],
					where: {
						'name': {
							[Op.iLike]: '%' + req.params.param + '%'
						}
					},
					limit: 5
				}).then(function(companies) {
					var completedRequest4 = 0;

					/* Start Companies if statement */
					if (Object.keys(companies).length == 0) {
						googleMapsClient.placesAutoComplete({
							input: req.params.param,
												//types: ['geocode', 'establishment']
											}).asPromise()
						.then(function(response) {
							var completedRequest5 = 0;

							/* Start Google Maps if statement */
							if (response.json.predictions.length == 0) {
								return res.send(data);
							}
							/* End Google Maps if statement */

							/* Start Google Maps for loop */
							for (let m = 0; m < response.json.predictions.length; m++) {
								var datum = {};
								datum["name"] = response.json.predictions[m].description;
								// datum["image"] = 
								datum["link"] = '/venues/' + response.json.predictions[m].place_id;
								data["suggests"]["Venues"].push(datum);
								completedRequest5++;

								if (completedRequest5 == response.json.predictions.length) {
									console.log('data: ' + data);
									return res.send(data);
								}
								/* End Google Maps complete request if statement */
							}
							/* End Google Maps for loop */
						}).catch(function(err) {
							console.log(err);
							res.status(404).send("Sorry, something went wrong with your request.");
						});
						/* End Google Maps*/

					}
					/* End Companies if statement*/

					/* Start Companies for loop*/
					for (let l = 0; l < Object.keys(companies).length; l++) {
						var datum = {};
						datum["name"] = companies[l].name;
						// datum["image"] = 
						datum["link"] = '/companies/' + companies[l].id;
						data["suggests"]["Companies"].push(datum);
						completedRequest4++;

						if (completedRequest4 == Object.keys(companies).length) {
							// do next
							googleMapsClient.placesAutoComplete({
								input: req.params.param,
								//types: ['geocode', 'establishment']
							}).asPromise()
							.then(function(response) {
								var completedRequest5 = 0;

							/* Start Google Maps if statement */
								if (response.json.predictions.length == 0) {
									return res.send(data);
								}
								/* End Google Maps if statement */

								for (let m = 0; m < response.json.predictions.length; m++) {
									var datum = {};
									datum["name"] = response.json.predictions[m].description;
									// datum["image"] = 
									datum["link"] = '/venues/' + response.json.predictions[m].place_id;
									data["suggests"]["Venues"].push(datum);
									completedRequest5++;

									if (completedRequest5 == response.json.predictions.length) {
										console.log('data: ' + data);
										return res.send(data);
									}
									/* End Google Maps complete request if statement */
								}
								/* End Google Maps for loop */
							}).catch(function(err) {
								console.log(err);
								res.status(404).send("Sorry, something went wrong with your request.");
							});
							/* End Google Maps*/
						}
						/* End Companies complete request if statement */
					}
					/* End Companies for loop */

				}).catch(function(err) {
					console.log(err);
					res.status(404).send("Sorry, something went wrong with your request.");
				});
				/* End Companies*/
			}
			/* End Shows if statement */

			/* Start Shows for loop */
			for (let i = 0; i < Object.keys(shows).length; i++) {
				var datum = {};
				datum["name"] = shows[i].title;
				datum["image"] = '/static' + shows[i].picture;
				datum["link"] = '/shows/' + shows[i].id;
				data["suggests"]["Shows"].push(datum);
				completedRequest1++;

				/* Start Shows complete request if statement */
				if (completedRequest1 == Object.keys(shows).length) {
					Company.findAll({
					attributes: ['id', 'name'],
					where: {
						'name': {
							[Op.iLike]: '%' + req.params.param + '%'
						}
					},
					limit: 5
				}).then(function(companies) {
					var completedRequest4 = 0;

					/* Start Companies if statement */
					if (Object.keys(companies).length == 0) {
						googleMapsClient.placesAutoComplete({
							input: req.params.param,
							//types: ['geocode', 'establishment']
						}).asPromise()
						.then(function(response) {
							var completedRequest5 = 0;

							/* Start Google Maps if statement */
							if (response.json.predictions.length == 0) {
								return res.send(data);
							}
							/* End Google Maps if statement */

							/* Start Google Maps for loop */
							for (let m = 0; m < response.json.predictions.length; m++) {
								var datum = {};
								datum["name"] = response.json.predictions[m].description;
								// datum["image"] = 
								datum["link"] = '/venues/' + response.json.predictions[m].place_id;
								data["suggests"]["Venues"].push(datum);
								completedRequest5++;

								if (completedRequest5 == response.json.predictions.length) {
									console.log('data: ' + data);
									return res.send(data);
								}
								/* End Google Maps complete request if statement */
							}
							/* End Google Maps for loop */
						}).catch(function(err) {
							console.log(err);
							res.status(404).send("Sorry, something went wrong with your request.");
						});
						/* End Google Maps*/

					}
					/* End Companies if statement*/

					/* Start Companies for loop*/
					for (let l = 0; l < Object.keys(companies).length; l++) {
						var datum = {};
						datum["name"] = companies[l].name;
						// datum["image"] = 
						datum["link"] = '/companies/' + companies[l].id;
						data["suggests"]["Companies"].push(datum);
						completedRequest4++;

						if (completedRequest4 == Object.keys(companies).length) {
							// do next
							googleMapsClient.placesAutoComplete({
								input: req.params.param,
								//types: ['geocode', 'establishment']
							}).asPromise()
							.then(function(response) {
								var completedRequest5 = 0;

							/* Start Google Maps if statement */
								if (response.json.predictions.length == 0) {
									return res.send(data);
								}
								/* End Google Maps if statement */

								for (let m = 0; m < response.json.predictions.length; m++) {
									var datum = {};
									datum["name"] = response.json.predictions[m].description;
									// datum["image"] = 
									datum["link"] = '/venues/' + response.json.predictions[m].place_id;
									data["suggests"]["Venues"].push(datum);
									completedRequest5++;

									if (completedRequest5 == response.json.predictions.length) {
										console.log('data: ' + data);
										return res.send(data);
									}
									/* End Google Maps complete request if statement */
								}
								/* End Google Maps for loop */
							}).catch(function(err) {
								console.log(err);
								res.status(404).send("Sorry, something went wrong with your request.");
							});
							/* End Google Maps*/
						}
						/* End Companies complete request if statement */
					}
					/* End Companies for loop */

				}).catch(function(err) {
					console.log(err);
					res.status(404).send("Sorry, something went wrong with your request.");
				});
				/* End Companies*/
				}
				/* End Shows complete request if statement */
			}
			/* End Shows for loop */
		}).catch(function(err) {
			console.log(err);
			res.status(404).send("Sorry, something went wrong with your request.");
		});
		/* End Shows */
	}
});

router.get('/searchAll/:param', function(req, res, next) {
	console.log('pls');
})
module.exports = router;
const express = require('express');
const router = express.Router();

var User = require('../../models').User;
var LocalUser = require('../../models').LocalUser;
var FacebookUser = require('../../models').FacebookUser;
var Show = require('../../models').Show;

var Sequelize = require('sequelize');
const Op = Sequelize.Op;

var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyCqD0RPTp6wV2-Qr2N3LPYLeK9_8qZt1wI',
  Promise: Promise
});

router.get('/', function(req, res, next) {
	// TODO
});

router.get('/:venueId', function(req, res, next) {
	var startDate = new Date();
	var endDate = new Date();
	endDate.setMonth(endDate.getMonth() + 1); 
	Show.findAll({
		order: [
			['date', 'ASC']
		],
		where: {
			range: {
				[Op.overlap]: [startDate, endDate]
			},
			venue: req.params.venueId
		}
	}).then(function(shows) {
		googleMapsClient.place({
			placeid: req.params.venueId
		}).asPromise()
		.then(function(response) {
			var photoReferences = [];
			var completedRequests = 0;
			//console.log(response.json.result.photos[0].photo_reference);

			if (!response.json.result.photos) {
				// The place has no associated photos
				console.log('no photos');
				res.render('venue.ejs', {
					'venue': response.json.result,
					'photoReferences': photoReferences,
					'shows': shows
				});
			} else {
				console.log('yes photos');
				for (let i = 0; i < Object.keys(response.json.result.photos).length; i++) {
					completedRequests++;
					photoReferences.push(response.json.result.photos[i].photo_reference);
					if (completedRequests == Object.keys(response.json.result.photos).length) {
						res.render('venue.ejs', {
							'venue': response.json.result,
							'photoReferences': photoReferences,
							'shows': shows
						});
					}
				}
				
			}

		}).catch(function(err) {
			// can't find a show by that Google place id
			console.log(err);
			res.status(404).send("Sorry, we can't find a venue by that id");
		});

	}).catch(function(err) {
		console.log(err);
		res.status(404).send('Sorry something went wrong with your request.');
	});


});

module.exports = router;


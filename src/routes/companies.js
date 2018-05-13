const express = require('express');
const router = express.Router();

var User = require('../../models').User;
var LocalUser = require('../../models').LocalUser;
var FacebookUser = require('../../models').FacebookUser;
var Show = require('../../models').Show;
var Company = require('../../models').Company;

var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyCqD0RPTp6wV2-Qr2N3LPYLeK9_8qZt1wI',
  Promise: Promise
});

router.get('/', function(req, res, next) {
	// TODO
});

router.get('/:companyId', function(req, res, next) {
	Company.findById(req.params.companyId)
	.then(function(company) {
		if (!company) {
			// no such company
			res.status(404).send('Sorry something went wrong with your request.');
		} else {
			res.render('company.ejs', {company: company});
		}
	}).catch(function(err) {
		console.log(err);
		res.status(404).send('Sorry something went wrong with your request.');
	});
});

module.exports = router;


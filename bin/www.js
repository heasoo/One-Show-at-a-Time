#!/usr/bin/env node
require('babel-register');
var app = require('../src/app.js');
var debug = require('debug')('artlive:server');
var http = require('http');
var normalizePort = require('normalize-port');
var models = require('../models');
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

var server = http.createServer(app);

models.sequelize.sync().then(function() {
	server.listen(port, function() {
		debug('Listening on: ' + server.address().port);
	});
	server.on('error', onError);
	server.on('listening', onListening);
});

function onError(error) {
	if (error.syscall !== 'listen') {
	   throw error;
	 }

	 var bind = typeof port === 'string'
	   ? 'Pipe ' + port
	   : 'Port ' + port;

	 // handle specific listen errors with friendly messages
	 switch (error.code) {
	   case 'EACCES':
	     console.error(bind + ' requires elevated privileges');
	     process.exit(1);
	     break;
	   case 'EADDRINUSE':
	     console.error(bind + ' is already in use');
	     process.exit(1);
	     break;
	   default:
	     throw error;
	 }
}

function onListening() {
	var address = server.address();
	var bind = typeof address === 'string'
		? 'pipe ' + address
		: 'port ' + address.port;
	debug('Listening on ' + bind); 
}
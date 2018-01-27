var express = require('express');
var app = express();
var path = require('path');

// middleware
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var ConnectRoles = require('connect-roles');
var flash = require('connect-flash');
var multer = require('multer');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var routes = require('./routes/index');
var users = require('./routes/users');
var shows = require('./routes/shows');
var roles = new ConnectRoles();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');  // set up ejs for templating

app.use(morgan('dev'));   // log every request to console
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());  // read cookies

// required for passport
app.use(session({secret: 'purplebabyeater', resave: false, saveUnitialized: false}));
app.use(passport.initialize());
app.use(passport.session());    // persistant login sessopm

app.use(flash());   // use connect-flash for flash messages
app.use(roles.middleware());

// Makes user variable available in templates.
// Source: http://stackoverflow.com/a/20912861
app.use(function (req, res, next) {
    res.locals.user = req.user;
    next();
});

app.use('/static', express.static(path.join(__dirname, '../public')));
app.use('/', routes);
app.use('/users', users);
app.use('/shows', shows);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var data = {
        status: 404,
        message: 'Not Found',
        url: req.url
    };
    res.status(404)
        .send(data)
        .end();
});


// development error handler
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
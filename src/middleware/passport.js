var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../../models').User;
var LocalUser = require('../../models').LocalUser;
var FacebookUser = require('../../models').FacebookUser;
var bcrypt = require('bcryptjs');
var configAuth = require('../../config/thirdPartyConfig.js');
var FB = require('fb');

/* Store user id to session*/
passport.serializeUser(function(user, done) {
    done(null, user);       
});

/* Attach user object to req*/
passport.deserializeUser(function(obj, done) {  
/*  User.findAll({
        where: {
            'id': id
        }
    })
    .then(function(users) {
        done(null, users[0]);          
    })
    .catch(function(error) {
      done(error, null);
  });*/
  done(null,obj);
});

/* Local Strategy */
passport.use('local-signup', new LocalStrategy ({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},
function(req, email, password, done) {
    var hash = bcrypt.hashSync(password, bcrypt.genSaltSync(8));
    LocalUser.findOne({
        where: {
            'email': email
        }
    }).then(function(user) {
        if (!user) {
            User.create({

            }).then(function(_user) {
                LocalUser.create({
                    'id': _user.id,
                    'email': email,
                    'password': hash,
                    'name': req.body.name
                }).then(function(localuser) {
                    done(null, localuser);
                });                
            });
        } else {
            done(null, false, 'Email already exists.');
        }
    }).catch(function(err) {
        console.log(err);
        return done(err);
    });
})
);

passport.use('local-login', new LocalStrategy ({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},
function(req, email, password, done) {
    LocalUser.findOne({
        where: {
            'email': email
        }
    }).then(function(user) {
        if (!user) {
            done(null, false, 'The email does not exist.');
        }

        var passwordDB = user.password;         
        if (bcrypt.compareSync(password, passwordDB)) {
            console.log('logging in...');
            done(null, user);
        } else {
            console.log('wrong password');
            done(null, false, 'Wrong credentials.');
        }
    }).catch(function(err) {
        console.log(err);
        return done(err);
    });
})
);

/* Facebook Strategy */
passport.use(new FacebookStrategy ({
    clientID        : configAuth.facebookAuth.clientID,
    clientSecret    : configAuth.facebookAuth.clientSecret,
    callbackURL     : "http://localhost:3000/users/auth/facebook/callback", /*configAuth.facebookAuth.callbackURL*/
    profileFields   :['id', 'email', 'name', 'picture.type(large)']
},
function(token, refreshToken, profile, done) {
    FacebookUser.findOne({
        where: {
            'fb_id': profile.id
        }
    }).then(function(user) {
            // FB user exists in DB, update user
            if (user) {
                // both middle name and email exist
                if (profile.name.middleName && profile.emails) {
                    user.update({
                        'name': profile.name.givenName + ' ' + profile.name.middleName + ' ' + profile.name.familyName,
                        'email': profile.emails[0].value,
                        'profile_picture': profile.photos[0].value
                    }).then(function() {
                        console.log('user updated 1');
                    }).catch(function(err) {
                        console.log(err);
                    });
                }

                // middle name does not exist, email exists
                if (profile.emails) {
                    user.update({
                        'name': profile.name.givenName + ' ' + profile.name.familyName,
                        'email': profile.emails[0].value,
                        'profile_picture': profile.photos[0].value                            
                    }).then(function() {
                        console.log('user updated 2');
                    }).catch(function(err) {
                        console.log(err);
                    });
                }

                // middle name exists, email does not exist
                if (profile.name.middleName) {
                    user.update({
                        'name': profile.name.givenName + ' ' + profile.name.middleName + ' ' + profile.name.familyName,
                        'email': null,
                        'profile_picture': profile.photos[0].value
                    }).then(function() {
                        console.log('user updated 3');
                    }).catch(function(err) {
                        console.log(err);
                    });
                } 
                    
                // neither middle name nor email exist
                if (!profile.name.middleName && !profile.emails) {
                    user.update({
                        'name': profile.name.givenName + ' ' + profile.name.familyName,
                        'email': null,
                        'profile_picture': profile.photos[0].value
                    }).then(function() {
                        console.log('user updated 4');
                    }).catch(function(err) {
                        console.log(err);
                    });                   
                }

                FB.setAccessToken(token);
                return done(null, user);
            } else {
                // FB User doesn't exist in DB, create one
                FB.setAccessToken(token);
                User.create({

                }).then(function(_user) {
                    if (profile.name.middleName && profile.emails) {
                        FacebookUser.create({
                            'id': _user.id,
                            'fb_id': profile.id,
                            'name': profile.name.givenName + ' ' + profile.name.middleName + ' ' + profile.name.familyName,
                            'email': profile.emails[0].value,
                            'profile_picture': profile.photos[0].value
                        }).then(function(fbUser) {
                            console.log('user created 1');
                            return done(null, fbUser);
                        }).catch(function(err) {
                            console.log(err);
                        });                
                    }

                    if (profile.name.middleName) {
                        FacebookUser.create({
                            'id': _user.id,
                            'fb_id': profile.id,
                            'name': profile.name.givenName + ' ' + profile.name.middleName + ' ' + profile.name.familyName,
                            'email': null,
                            'profile_picture': profile.photos[0].value
                        }).then(function(fbUser) {
                            console.log('user created 2');
                            return done(null, fbUser);
                        }).catch(function(err) {
                            console.log(err);
                        });                           
                    }

                    if (profile.emails) {
                        FacebookUser.create({
                            'id': _user.id,
                            'fb_id': profile.id,
                            'name': profile.name.givenName + ' ' + profile.name.familyName,
                            'email': profile.emails[0].value,
                            'profile_picture': profile.photos[0].value
                        }).then(function(fbUser) {
                            console.log('user created 3');
                            return done(null, fbUser);
                        }).catch(function(err) {
                            console.log(err);
                        });                           
                    }                        

                    if (!profile.emails && !profile.name.middleName) {
                        FacebookUser.create({
                            'id': _user.id,
                            'fb_id': profile.id,
                            'name': profile.name.givenName + ' ' + profile.name.familyName,
                            'email': null,
                            'profile_picture': profile.photos[0].value
                        }).then(function(fbUser) {
                            console.log('user created 4');
                            return done(null, user);
                        }).catch(function(err) {
                            console.log(err);
                        });       
                    }                   
                });
            }
        }).catch(function(err) {
            console.log(err);
            return done(err);
        });
    })
);

module.exports = FB;
module.exports = passport;

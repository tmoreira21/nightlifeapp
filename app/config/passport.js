'use strict';

// load facebook passport
var FacebookStrategy = require('passport-facebook').Strategy;

// load user model
var User = require('../models/users');

//load auth configuration variables
var configAuth = require('./auth');

module.exports = function (passport) {

    // used to serialize the user for the session - always needed when using passport
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

    // used to deserialize the user - always needed when using passport
	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});
	
    passport.use(new FacebookStrategy({
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL},
        function (token, refreshToken, profile, done) {
            // make the code asynchronous
            // User.findOne won't fire until we have all our data back from Twitter
            process.nextTick(function () {
                // find user
                User.findOne({ 'facebook.id': profile.id }, function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    // if the user is found then log in
                    if (user) {
                        return done(null, user);
                    } else {
                        // else create user on DB and login
                        var newPlace = new User();
    
                        newPlace.facebook.id = profile.id;
                        newPlace.facebook.token = token;
                        newPlace.facebook.name = profile.displayName;
                        newPlace.facebook.provider = profile.provider;

                        newPlace.save(function (err) {
                            if (err) {
                                throw err;
                            }
                            return done(null, newPlace);
                        });
                    }
                });
            });
        })
    );
};
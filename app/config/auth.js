'use strict';

module.exports = {
    'yelpAuth': {
        'clientId': process.env.YELP_KEY,
        'clientSecret': process.env.YELP_SECRET,
    },
    'facebookAuth': {
        'clientID': process.env.FACEBOOK_KEY,
        'clientSecret': process.env.FACEBOOK_SECRET,
        'callbackURL': process.env.FACEBOOK_CALLBACK_URL
    }
};
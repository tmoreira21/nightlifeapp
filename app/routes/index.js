'use strict'

var ClickHandler = require(process.cwd() + '/app/controllers/clickHandler.server.js');

module.exports = function (app, passport, ssn) {
    
    var clickHandler = new ClickHandler(); 
    
    //OK
    app.route('/')
        .get(clickHandler.search);
    app.route('/')        
        .post(clickHandler.search);

    app.route('/going')
        .get(isLoggedIn,clickHandler.going);

    //--------------------LOGIN LOGOUT-------------------
    
    app.route('/logout')
        .get(isLoggedIn,function (req, res) {
            ssn = req.session;
            ssn.logIn = false;
            req.logout();
            res.redirect('/');
    });
        
    //login handler
    app.route('/auth/facebook')
        .get(passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.route('/auth/facebook/callback')
        .get(
        passport.authenticate('facebook', {
            failureRedirect : '/failure'
    }),
        function(req, res) 
        {
            ssn = req.session;
            ssn.logIn = true;
            return res.redirect('/');
        }
    );

    function isLoggedIn (req, res, next) {
        ssn = req.session;
        if (req.isAuthenticated()) {
            ssn.logIn = true;
            return next();
        }
        ssn.logIn = false;
        res.redirect('/');
    }
};

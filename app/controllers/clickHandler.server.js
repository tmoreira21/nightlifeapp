'use strict';

var Places = require('../models/places.js');

function clickHandler () {
    
     this.search = function (req, res) {
        var ssn = req.session;
        var data = req.body;
        var response = {};
        if(!ssn.logIn){ssn.logIn = false;}
        if(!ssn.term){ssn.term = '';}
        if((data['term'])||(ssn.term.length > 0)){
            var pesq = '';
            if(data['term']){ ssn.term = data['term'];pesq = data['term'];}else{pesq = ssn.term;}
            const yelp = require('yelp-fusion');
            const token = yelp.accessToken(process.env.YELP_KEY, process.env.YELP_SECRET).then(response => {
                const client = yelp.client(response.jsonBody.access_token);
                client.search({
                  location: String(pesq),
                  categories: 'nightlife,bars'
                }).then(response => {
                    var businesses = response.jsonBody.businesses;
                    var today = todaysDate();
                    for (var i = 0; i < businesses.length; i++) {
                        businesses[i].going = 0;
                        (function() {
                            var biz = businesses[i];
                            var tod = today;
                            Places.findOne({ 'descript.idPlace': biz.id, 'descript.day': tod }, function (err, place) {
                                if (err) {
                                    console.log(err);
                                }
                                // if entry does not exist insert in DB
                                if (!place) {
                                    //----------------------------------
                                    var newPlace = new Places();
                
                                    newPlace.descript.idPlace = biz.id;
                                    newPlace.descript.name = biz.name;
                                    newPlace.descript.day = tod;
                                    newPlace.descript.going = 0;
            
                                    newPlace.save(function (err) {
                                        if (err) {
                                            throw err;
                                        }
                                    });
                                }else{
                                    biz.going = place.descript.going;
                                }
                            });
                        })();
                    }
                    res.render('index',{term:pesq,bars:businesses,logIn:ssn.logIn});
                }).catch(e => {
                  console.log(e);
                  res.render('index',{term:pesq,bars:response,logIn:ssn.logIn});
                });
                
            }).catch(e => {
              console.log(e);
              res.render('index',{term:pesq,bars:response,logIn:ssn.logIn});
            });
        }else{
            res.render('index',{term:"",bars:response,logIn:ssn.logIn});
        }
    }
    
    this.going = function (req, res) {
        var ssn = req.session;
        var user = ssn.passport.user;
        var plc = req.query.q;
        var today = todaysDate();

        Places.findOne({ 'descript.idPlace': String(plc), 'descript.day': today, 'user._id': String(user) }, function (err, place) {
            if (err) {
                console.log(err);
            }
            if (!place) {
                Places.findOneAndUpdate({ 'descript.idPlace': String(plc), 'descript.day': today }, { '$inc': { 'descript.going': 1 } }, { upsert : true },  function(err, dc) { if (err) { console.log(err); } });
                Places.update( { 'descript.idPlace': String(plc), 'descript.day': today },{ $push: { 'user': { '_id': String(user) } } }, function(err, dc) { if (err) { console.log(err); } });
                res.send(JSON.stringify("1"));
            }else{
                Places.findOneAndUpdate({ 'descript.idPlace': String(plc), 'descript.day': today }, { '$inc': { 'descript.going': -1 } }, { upsert : true },  function(err, dc) { if (err) { console.log(err); } });
                place.user.remove( { '_id': String(user) }, function(err, dc) { if (err) { console.log(err); } });
                place.save(); 
                res.send(JSON.stringify("-1"));
            }
            
        });
    }

    function todaysDate(){
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        if(dd<10) {
            dd='0'+dd
        } 
        if(mm<10) {
            mm='0'+mm
        } 
        today = dd+'/'+mm+'/'+yyyy;
        return today;
    }
}

module.exports = clickHandler;
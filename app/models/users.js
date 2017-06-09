'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    _id: { type: Schema.ObjectId, auto: true },
    facebook: {
        id : String,
        token : String,
        name : String,
        provider : String
    }
});

module.exports = mongoose.model('User', User);
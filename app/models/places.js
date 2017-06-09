'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Place = new Schema({
    _id: { type: Schema.ObjectId, auto: true },
	descript: {
		idPlace: String,
		name: String,
		day: Date,
		going: Number
	},
   user: [{
      _id: String
   }]
});

module.exports = mongoose.model('Place', Place);
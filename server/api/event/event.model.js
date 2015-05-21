'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var eventSchema = new Schema({
	name: String,
	description: String,
	picture: String,
	creation: Number,
	creator: {
		id: Number,
		username: String
	},
	date: Number,
	location: String,
	participants: [{
		id: Number,
		name: String,
		picture: String,
		memberType: String
	}],
	categories: [String],
	quota: Number,
	memories: [{
		provider: { type: String, required: true },
		picture: String,
		text: String
	}]

});

module.exports = mongoose.model('event', eventSchema);
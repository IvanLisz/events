'use strict';

var mongoose 		= require('mongoose'),
	Schema 			= mongoose.Schema;

var EventSchema = new Schema({
	id: Number,
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

/**
 * Pre-save hook
 */
EventSchema
	.pre('save', function(next) {
		var self = this;
		self.constructor
		.findOne()
		.sort('-id')
		.exec(function (err, member) {
			console.log("err");
			console.log("last event");
			console.log(member);
			if (!member) {
				self.id = 568;
			} else {
				self.id = member.id + 1;
			}
			console.log("now event id");
			console.log(self.id);
			next();
		});
	});

module.exports = mongoose.model('event', EventSchema);
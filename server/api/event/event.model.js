'use strict';

var mongoose 		= require('mongoose'),
	Schema 			= mongoose.Schema;

var EventSchema = new Schema({
	id: Number,
	name: String,
	description: String,
	picture: String,
	creation: { type: Date, default: Date.now },
	creator: {
		id: Number,
		name: String,
		username: String,
		picture: String
	},
	duration: { start: Date, end: Date },
	location: String,
	participants: [{
		id: Number,
		name: String,
		picture: String,
		tid: Number,
		linkedWith: Number
	}],
	categories: [String],
	quota: { type: Number, default: -1 },
	memories: [{
		name: String,
		provider: { type: String, required: true },
		picture: String,
		text: String
	}],
	favoritedBy: [{
		id: Number,
		name: String,
		bio: String,
		picture: String
	}],
	tickets: [{
		id: { type: Number, default: 0 },
		price: { type: Number, default: 0 },
		category: { type: String, default: "General" }
	}],
	publications: [{
		uid: Number,
		user:{
			id: Number,
			pic: String,
			name: String,
			username: String
		},
		source: String,
		text: String,
		media: String
	}],
	hashtag: { type: String, default: null}
});

/**
 * Pre-save hook
 */
EventSchema
	.pre('save', function(next) {
		if (!this.isNew) return next();
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
'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var BadgeSchema = new Schema({
	id: Number,
	name: String,
	info: String,
	picture: String,
});


BadgeSchema
	.pre('save', function(next) {
		if (!this.isNew) return next();
		var self = this;
		self.constructor
		.findOne()
		.sort('-id')
		.exec(function (err, member) {
			if (!member) {
				self.id = 1;
			} else {
				self.id = member.id + 1;
			}
			next();
		});
	});

module.exports = mongoose.model('Badge', BadgeSchema);
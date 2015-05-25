'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var CursorSchema = new Schema({
	lastElement: { type: String, required: true },
	limit: { type: Number, required: true }
});

module.exports = mongoose.model('Cursor', CursorSchema);
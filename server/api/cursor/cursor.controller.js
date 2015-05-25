/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /cursors              ->  index
 * POST    /cursors              ->  create
 * GET     /cursors/:id          ->  show
 * PUT     /cursors/:id          ->  update
 * DELETE  /cursors/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Cursor = require('./cursor.model');


// Get a single cursor
exports.show = function(req, res) {
	console.log('get cursor');
	console.log(req.params.id);
	Cursor.findById(req.params.id, function (err, cursor) {
		if(err) { return _handleError(res, err); }
		if(!cursor) { return res.send(404); }
	console.log('cursor');
	console.log(cursor);
		return res.json(cursor);
	});
};

// Creates a new cursor in the DB.
exports.create = function(req, res) {
	console.log("create cursor");
	console.log(req.body);
	Cursor.create(req.body, function(err, cursor) {
		if(err) { return _handleError(res, err); }
		return res.json(201, cursor);
	});
};


// Deletes a cursor from the DB.
exports.destroy = function(req, res) {
	Cursor.findById(req.params.id, function (err, cursor) {
		if(err) { return _handleError(res, err); }
		if(!cursor) { return res.send(404); }
		cursor.remove(function(err) {
			if(err) { return _handleError(res, err); }
			return res.send(204);
		});
	});
};

function _handleError(res, err) {
	return res.send(500, err);
}
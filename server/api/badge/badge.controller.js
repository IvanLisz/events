/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /badges              ->  index
 * POST    /badges              ->  create
 * GET     /badges/:id          ->  show
 * PUT     /badges/:id          ->  update
 * DELETE  /badges/:id          ->  destroy
 */

'use strict';

var _ 		= require('lodash'),
	Badge 	= require('./badge.model');

// Get list of badges
function index (req, res) {
	Badge.find(function (err, badges) {
		if(err) { return _handleError(res, err); }
		return res.json(200, badges);
	});
};

// Get a single badge
function show (req, res) {
	Badge.findById(req.params.id, function (err, badge) {
		if(err) { return _handleError(res, err); }
		if(!badge) { return res.send(404); }
		return res.json(badge);
	});
};

// Creates a new badge in the DB.
function create (req, res) {
	Badge.create(req.body, function(err, badge) {
		if(err) { return _handleError(res, err); }
		return res.json(201, badge);
	});
};

// Updates an existing badge in the DB.
function update (req, res) {
	if(req.body._id) { delete req.body._id; }
	Badge.findById(req.params.id, function (err, badge) {
		if (err) { return _handleError(res, err); }
		if(!badge) { return res.send(404); }
		var updated = _.merge(badge, req.body);
		updated.save(function (err) {
			if (err) { return _handleError(res, err); }
			return res.json(200, badge);
		});
	});
};

// Deletes a badge from the DB.
function destroy (req, res) {
	Badge.findById(req.params.id, function (err, badge) {
		if(err) { return _handleError(res, err); }
		if(!badge) { return res.send(404); }
		badge.remove(function(err) {
			if(err) { return _handleError(res, err); }
			return res.send(204);
		});
	});
};

function _handleError(res, err) {
	return res.send(500, err);
}

module.exports = {
	index: index,
	show: show,
	create: create,
	update: update,
	destroy: destroy
}
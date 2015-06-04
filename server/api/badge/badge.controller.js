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
	Badge 	= require('./badge.model'),
	User 	= require('../user/user.model');

// Get list of badges
function index (req, res) {
	Badge.find(function (err, badges) {
		if(err) { return _handleError(res, err); }
		return res.json(200, badges);
	});
};

// Get a single badge
function show (req, res) {
	Badge.find({id: req.params.id }, function (err, badge) {
		if(err) { return _handleError(res, err); }
		if(!badge) { return res.send(404); }
		return res.json(badge);
	});
};


function _handleError(res, err) {
	return res.send(500, err);
}

module.exports = {
	index: index,
	show: show
}
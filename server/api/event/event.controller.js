/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /events              ->  index
 * POST    /events              ->  create
 * GET     /events/:id          ->  show
 * GET     /events/name/:name   ->  showByName
 * PUT     /events/:id          ->  update
 * DELETE  /events/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Event = require('./event.model');

// Get list of events
exports.index = function(req, res) {

	Event.find(function (err, events) {
		if(err) { return handleError(res, err); }
		return res.json(200, events);
	});

};

// Get a single event
exports.show = function(req, res) {
	Event.findById(req.params.id, function (err, event) {
		if(err) { return handleError(res, err); }
		if(!event) { return res.send(404); }
		return res.json(event);
	});
};

// Get a single event by name
exports.showByName = function(req, res) {
	Event.find({name: new RegExp(req.params.name, 'i')}, function (err, events) {
		if(err) { return handleError(res, err); }
		if(!events) { return res.send(404); }
		return res.json({
			results: events
		});
	});
};

// Creates a new event in the DB.
exports.create = function(req, res) {
	 var newEvent = new Event(req.body);
	newEvent.creation = Date.now();
	newEvent.save(function (err, event) {
		if(err) { return handleError(res, err); }
		return res.json(201, event);
	});
};

// Updates an existing event in the DB.
exports.update = function(req, res) {
	var userId = req.user._id;
	if (userId == req.body.creator.id){
		if(req.body._id) { delete req.body._id; }
		Event.findById(req.params.id, function (err, event) {
			if (err) { return handleError(res, err); }
			if(!event) { return res.send(404); }
			var updated = _.merge(event, req.body);
			updated.save(function (err) {
				if (err) { return handleError(res, err); }
				return res.json(200, event);
			});
		});
	}

};

// Deletes a event from the DB.
exports.destroy = function(req, res) {
	var userId = req.user._id;
	if (userId == req.body.creator.id){
		Event.findById(req.params.id, function (err, event) {
			if(err) { return handleError(res, err); }
			if(!event) { return res.send(404); }
			event.remove(function(err) {
				if(err) { return handleError(res, err); }
				return res.send(204);
			});
		});
	}
};



function handleError(res, err) {
	return res.send(500, err);
}
/*
module.exports = {
	createUserCalendar: createUserCalendar
}*/
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
function index (req, res) {
	Event.find(function (err, events) {
		if(err) { return _handleError(res, err); }
		return res.json(200, events);
	});
}

// Get a single event
function show (req, res) {
	Event.find({id: req.params.id}, function (err, event) {
		if(err) { return _handleError(res, err); }
		if(!event) { return res.send(404); }
		return res.json(event);
	});
}

// Get a single event by name
function showByName (req, res) {
	Event.find({name: new RegExp(req.params.name, 'i')}, function (err, events) {
		if(err) { return _handleError(res, err); }
		if(!events) { return res.send(404); }
		return res.json(events);
	});
}

// Creates a new event in the DB.
function create (req, res) {
	var newEvent = new Event(req.body);
	newEvent.participants.push({
		id: req.user._id,
		name: req.user.name,
		picture: req.user.picture,
		memberType: "creator"});

	newEvent.creation = Date.now();
	newEvent.save(function (err, event) {
		if(err) { return _handleError(res, err); }
		return res.json(201, event);
	});
};

// Updates an existing event in the DB.
function update (req, res) {
	var userId = req.user._id;
	if (userId == req.body.creator.id){
		if(req.body._id) { delete req.body._id; }
		Event.find({id: req.params.id}, function (err, event) {
			if (err) { return _handleError(res, err); }
			if(!event) { return res.send(404); }
			var updated = _.merge(event, req.body);
			updated.save(function (err) {
				if (err) { return _handleError(res, err); }
				return res.json(200, event);
			});
		});
	}

};

// Deletes a event from the DB.
function destroy (req, res) {
	var userId = req.user._id;
	if (userId == req.body.creator.id){
		Event.find({id: req.params.id}, function (err, event) {
			if(err) { return _handleError(res, err); }
			if(!event) { return res.send(404); }
			event.remove(function(err) {
				if(err) { return _handleError(res, err); }
				return res.send(204);
			});
		});
	}
};



function _handleError(res, err) {
	return res.send(500, err);
}



// Updates an existing event in the DB.
function addParticipant (req, res) {
	var userId = req.user._id;

	req.body.participants.push({
		id: userId,
		name: req.user.name,
		picture: req.user.picture,
		memberType: "participant"
	});

	if(req.body._id) { delete req.body._id; }

	Event.find({id: req.params.id}, function (err, event) {
		if (err) { return _handleError(res, err); }
		if(!event) { return res.send(404); }
		var updated = _.merge(event, req.body);
		updated.save(function (err) {
			if (err) { return _handleError(res, err); }
			return res.json(200, event);
		});
	});
};

// Updates an existing event in the DB.
function removeParticipant (req, res) {
	var userId = req.user._id;

	if(req.body._id) { delete req.body._id; }
	Event.find({id: req.params.id}, function (err, event) {
		if (err) { return _handleError(res, err); }
		if(!event) { return res.send(404); }
		var updated = _.merge(event, req.body);

		var index = updated.participants.map(function (obj){ return obj.id }).indexOf(userId);
		if (index == -1){
			return res.send(404);
		}

		updated.participants.splice(index, 1);

		updated.save(function (err) {
			if (err) { return _handleError(res, err); }
			return res.json(200, event);
		});
	});

};




module.exports = {
	index: index,
	show: show,
	showByName: showByName,
	create: create,
	update: update,
	destroy: destroy,
	addParticipant: addParticipant,
	removeParticipant: removeParticipant
}
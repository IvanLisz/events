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
var User = require('../user/user.model');

// Get list of events
function index (req, res) {
	Event.find(function (err, events) {
		if(err) { return _handleError(res, err); }
		return res.json(200, events);
	});
}

// Get a single event
function show (req, res) {
	Event.findOne({id: req.params.id}, function (err, event) {
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
		role: "creator"});

	newEvent.creation = Date.now();
	newEvent.save(function (err, event) {
		if(err) { return _handleError(res, err); }
		return res.json(201, event);
	});
}

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
}

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
}



function _handleError(res, err) {
	return res.send(500, err);
}


function _addEventToUser (user, eventID, callback){
	User.find({id: user.id}, function (err, userData) {
		if (err) { return callback(err, null); }
		if(!userData) { return callback(null, null); }

		userData = userData[0];

		var index = userData.events.indexOf(eventID);
		if (index != -1){
			return callback("User: Event is already in user", null);
		}
		userData.events.push({id: eventID});

		userData.save(function (err, doc) {
			if(err) {
				console.log(err);
				return callback(err, null);
			}
			return callback(null, doc)
		});
	}).limit(1);
}

function _addUserToEvent(user, eventID, callback){

	var newParticipant = {
		id: user.id,
		name: user.name,
		picture: user.picture,
		role: "guest"
	};

	Event.find({id: eventID}, function (err, eventData) {
		if (err) { return callback(err); }
		if(!eventData) { return callback(null,null) }

		eventData = eventData[0];

		var index = eventData.participants.map(function (obj){ return obj.id }).indexOf(user.id);
		if (index != -1){
			return callback("Event: User already participating", null);
		}
		eventData.participants.push(newParticipant);

		eventData.save(function (err, doc) {
			if(err) {
				console.log(err);
				return callback(err, null);
			}
			return callback(null, doc);
		});
	}).limit(1);


}

// Updates an existing event in the DB.
function addParticipant (req, res) {
	var user = req.user;
	var eventID = req.params.id;

	_addUserToEvent(user, eventID, function(err, doc){
		if (err){ return _handleError(res, err); }
		if (!doc){ return res.send(500); }

		_addEventToUser(user, eventID, function(err, doc){
			if (err){ return _handleError(res, err); }
			if (!doc){ return res.send(500); }

			return res.send(200);
		});
	});
}


function _removeUserFromEvent(user, eventID, callback){
	Event.find({id: eventID}, function (err, eventData) {
		if (err) { return callback(err); }
		if(!eventData) { return callback(null,null) }

		eventData = eventData[0];

		var index = eventData.participants.map(function (obj){ return obj.id }).indexOf(user.id);
		if (index == -1){
			return callback("Event: User is not participating", null);
		}

		eventData.participants.splice(index, 1);

		eventData.save(function (err, doc) {
			if(err) {
				console.log(err);
				return callback(err, null);
			}
			return callback(null, doc);
		});
	}).limit(1);

}

function _removeEventFromUser(user, eventID, callback){
	User.find({id: user.id}, function (err, userData) {
		if (err) { return callback(err, null); }
		if(!userData) { return callback(null, null); }

		userData = userData[0];

		var index = userData.events.indexOf(eventID);
		if (index == -1){
			return callback("User: Event is not in user", null);
		}
		userData.events.splice(index, 1);

		userData.save(function (err, doc) {
			if(err) {
				console.log(err);
				return callback(err, null);
			}
			return callback(null, doc)
		});
	}).limit(1);
}

// Updates an existing event in the DB.
function removeParticipant (req, res) {
	var user = req.user;
	var eventID = req.params.id;

	_removeUserFromEvent(user, eventID, function (err, doc){
		if (err){ return _handleError(res, err); }
		if (!doc){ return res.send(500); }

		_removeEventFromUser(user, eventID, function (err, doc){
			if (err){ return _handleError(res, err); }
			if (!doc){ return res.send(500); }

			return res.send(200);
		})
	});
}

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
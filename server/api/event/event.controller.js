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

var _ 		= require('lodash'),
	Event 	= require('./event.model'),
	User 	= require('../user/user.model'),
	gConfig = require('../../config/global-variables.js');

// Get list of events
function index (req, res) {
	console.log('get list');
	var type = req.query.date || null;
	var page = req.query.page || gConfig.pagination.defaultPage;
	var limit = req.query.limit || gConfig.pagination.defaultLimit;

	if (limit > gConfig.pagination.maxLimit){
		limit = gConfig.pagination.maxLimit;
	}

	switch (type) {
		case 'next':
			_findNextEvents(page, limit, function (err, nextEvents){
				if(err) { return _handleError(res, err) }
				return res.json(200, { data: nextEvents });
			});
		break;

		case 'now':
			_findCurrentEvents(page, limit, function (err, currentEvents){
				if(err) { return _handleError(res, err) }
				return res.json(200, { data: currentEvents });
			});
		break;

		case 'old':
			_findOldEvents(page, limit, function (err, oldEvents){
				if(err) { return _handleError(res, err) }
				return res.json(200, { data: oldEvents });
			});
		break;

		default:
			_findCurrentEvents(page, limit, function (err, currentEvents){
				if(err) { return _handleError(res, err) }

				if (currentEvents.length >= gConfig.pagination.defaultLimit) {
					return res.json(200, { data: currentEvents });
				}else{
					_findNextEvents(0, limit - currentEvents.length, function (err, nextEvents){
						if(err) { return _handleError(res, err) }
						var sendEvents = currentEvents.concat(nextEvents);

						if (sendEvents.length >= gConfig.pagination.defaultLimit) {
							return res.json(200, { data: sendEvents, lastResults: true });
						}else{
							_findOldEvents(0, limit - sendEvents.length, function (err, oldEvents){
								sendEvents = sendEvents.concat(oldEvents);
								return res.json(200, { data: sendEvents, lastResults: true });
							})
						}

					});
				}
			});
		break;
	}
}

function _findCurrentEvents(page, limit, callback){
	Event.find({"duration.start": {$lt: Date.now()}, "duration.end": {$gt: Date.now()}}, function (err, currentEvents) {
		if(err) { return callback(err, null);}
		return callback(err, currentEvents);
	}).skip((page)*limit).limit(limit).sort({"duration.start": 1});
}

function _findNextEvents(page, limit, callback){
	Event.find({"duration.start": {$gt: Date.now()}}, function (err, nextEvents) {
		if(err) { return callback(err, null);}
		return callback(err, nextEvents);
	}).skip((page)*limit).limit(limit).sort({"duration.start": 1});
}

function _findOldEvents(page, limit, callback){
	Event.find({"duration.end": {$lt: Date.now()}}, function (err, oldEvents) {
		if(err) { return callback(err, null);}
		return callback(err, oldEvents);
	}).skip((page)*limit).limit(limit).sort({"duration.end": -1});
}

// Get a single event
function show (req, res) {
	Event.find({id: req.params.id}, function (err, event) {
		if(err) { return _handleError(res, err); }
		if(!event) { return res.send(404); }
		event = event[0];
		return res.json(event);
	}).limit(1);
}

// Get a single event by name
function showByName (req, res) {
	if (req.params.name.length < 3){
		res.send(500); // min 3 characters
	}

	var page = req.query.page || gConfig.pagination.defaultPage;
	var limit = req.query.limit || gConfig.pagination.defaultLimit;

	var start = req.query.start || null;
	var end = req.query.end || 999999999999999; // es re villero ya se


	if (limit > gConfig.pagination.maxLimit){
		limit = gConfig.pagination.maxLimit;
	}

	if (!start || !end){
		Event.find({name: new RegExp(req.params.name, 'i'), "duration.end": {$gt: Date.now() }},  function (err, currentAndNextEvents) {
			if(err) { return _handleError(res, err); }
			if(!currentAndNextEvents) { return res.send(404); }
			if (currentAndNextEvents.length >= gConfig.pagination.defaultLimit) {
				return res.json(200, currentAndNextEvents);
			} else {
				Event.find({name: new RegExp(req.params.name, 'i'), "duration.end": {$lt: Date.now() }},  function (err, oldEvents) {
					if(!oldEvents) { return res.send(404); }
					var sendEvents = currentAndNextEvents.concat(oldEvents);
					return res.json(200, sendEvents);
				}).limit(limit - currentAndNextEvents.length).sort({"duration.end": -1});
			}
		}).skip((page)*limit).limit(limit).sort({"duration.start": 1});
	} else {
		Event.find({name: new RegExp(req.params.name, 'i'), "duration.start": {$gt: start }, "duration.end": {$lt: end }},  function (err, currentAndNextEvents) {
			if(err) { return _handleError(res, err); }
			if(!currentAndNextEvents) { return res.send(404); }
			return res.json(200, currentAndNextEvents);
		}).skip((page)*limit).limit(limit).sort({"duration.start": 1});
	}
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

		var index = userData.events.map(function (obj){ return obj.id }).indexOf(eventID);
		if (index !== -1){
			return callback("User: Event is already in user", null);
		}
		userData.events.push({id: eventID});

		userData.save(function (err, newUser) {
			if(err) {
				console.log(err);
				return callback(err, null);
			}
			return callback(null, newUser)
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

		if(eventData.quota.limit != -1 && eventData.quota.now >= eventData.quota.limit){ return callback("quota limit", null) };

		eventData.quota.now = eventData.quota.now + 1;

		var index = eventData.participants.map(function (obj){ return obj.id }).indexOf(user.id);
		if (index !== -1){
			return callback("Event: User already participating", null);
		}
		eventData.participants.push(newParticipant);

		eventData.save(function (err, doc) {
			if(err) {
				console.log(err);
				return callback(err, null);
			}
			return callback(null, newParticipant);
		});
	}).limit(1);


}

// Updates an existing event in the DB.
function addParticipant (req, res) {
	var user = req.user;
	var eventID = req.params.id;

	_addEventToUser(user, eventID, function(err, newUser){
		if (err){ return _handleError(res, err); }
		if (!newUser){ return res.send(500); }

		_addUserToEvent(user, eventID, function(err, newEvent){
			if (err){ return _handleError(res, err); }
			if (!newEvent){ return res.send(500); }
			return res.json(200, newEvent);
		});
	});
}


function _removeUserFromEvent(user, eventID, callback){
	Event.find({id: eventID}, function (err, eventData) {
		if (err) { return callback(err); }
		if(!eventData) { return callback(null,null) }

		eventData = eventData[0];

		var index = eventData.participants.map(function (obj){ return obj.id }).indexOf(user.id);
		if (index === -1) {
			return callback("Event: User is not participating", null);
		}

		eventData.participants.splice(index, 1);

		eventData.quota.now = eventData.quota.now - 1;

		eventData.save(function (err, newEvent) {
			if(err) {
				console.log(err);
				return callback(err, null);
			}
			return callback(null, newEvent);
		});
	}).limit(1);

}

function _removeEventFromUser(user, eventID, callback){
	User.find({id: user.id}, function (err, userData) {
		if (err) { return callback(err, null); }
		if(!userData) { return callback(null, null); }

		userData = userData[0];

		var index = userData.events.map(function (obj){ return obj.id }).indexOf(Number(eventID));
		if (index === -1) {
			return callback("User: Event is not in user", null);
		}
		userData.events.splice(index, 1);

		console.log(userData);

		userData.save(function (err, newUser) {
			if(err) {
				console.log(err);
				return callback(err, null);
			}
			return callback(null, newUser)
		});
	}).limit(1);
}

// Updates an existing event in the DB.
function removeParticipant (req, res) {
	var user = req.user;
	var eventID = req.params.id;

	_removeUserFromEvent(user, eventID, function (err, eventData){
		if (err){ return _handleError(res, err); }
		if (!eventData){ return res.send(500); }

		_removeEventFromUser(user, eventID, function (err, userData){
			if (err){ return _handleError(res, err); }
			if (!userData){ return res.send(500); }

			return res.send(200);
		});
	});
}

function getQuota(req, res) {
	var eventID = req.params.id;
	Event.find({id: Number(eventID)}, function (err, eventData) {
		if (err){ return _handleError(res, err); }
		if (!eventData){ return res.send(500); }

		eventData = eventData[0];


		var resObject = {
			now: eventData.quota.now
		};

		if (eventData.quota.limit > -1){
			resObject.pending = eventData.quota.limit - eventData.quota.now;
			resObject.pendingPercent =  (eventData.quota.limit - eventData.quota.now) * 100 / eventData.quota.limit;
			resObject.limit = eventData.quota.limit;
		}


		return res.json(200, resObject);
	}).limit(1);
}

module.exports = {
	index: index,
	show: show,
	showByName: showByName,
	create: create,
	update: update,
	destroy: destroy,
	addParticipant: addParticipant,
	removeParticipant: removeParticipant,
	getQuota: getQuota
}
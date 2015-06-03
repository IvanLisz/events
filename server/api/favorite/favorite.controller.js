'use strict';

var _ 		= require('lodash'),
	User 	= require('../user/user.model.js'),
	Event 	= require('../event/event.model.js'),
	gConfig 	= require('../../config/global-variables.js');


function _addFavToUser (user, eventID, callback){
	User.find({id: user.id}, function (err, userData) {
		if (err) { return callback(err, null); }
		if(!userData) { return callback(null, null); }

		userData = userData[0];

		var index = userData.favorites.indexOf(Number(eventID));
		if (index !== -1){
			return callback("User: event is already in user favorite list", null);
		}
		userData.favorites.push(Number(eventID));

		userData.save(function (err, newUser) {
			if(err) {
				console.log(err);
				return callback(err, null);
			}
			return callback(null, newUser)
		});
	}).limit(1);
}

function _addFavToEvent(user, eventID, callback){
	Event.find({id: Number(eventID)}, function (err, eventData){
		if (err) { return callback(err, null); }
		if(!eventData) { return callback(null, null); }

		eventData = eventData[0];

		var index = eventData.favoritedBy.map(function(obj) { return obj.id }).indexOf(Number(user.id));

		if (index !== -1) {
			return callback("Event: user is already in event favoritedBy list", null);
		}

		eventData.push({id: user.id, name: user.name, picture: user.picture, bio: user.bio});

		eventData.save(function(err, newEvent){
			if(err) {
				console.log(err);
				return callback(err, null);
			}
			return callback(null, newEvent);
		});
	}).limit(1);
}

function _removeFavFromEvent(user, eventID, callback){
	User.find({id: user.id}, function (err, eventData) {
		if (err) { return callback(err, null); }
		if(!eventData) { return callback(null, null); }

		eventData = eventData[0];

		var index = eventData.favoritedBy.map(function(obj) { return obj.id }).indexOf(Number(user.id));
		if (index === -1) {
			return callback("Event: user is not in events's favoritedBy list", null);
		}
		eventData.favoritedBy.splice(index, 1);

		eventData.save(function (err, newEvent) {
			if(err) {
				console.log(err);
				return callback(err, null);
			}
			return callback(null, newEvent)
		});
	}).limit(1);
}

function _removeFavFromUser(user, eventID, callback){
	User.find({id: user.id}, function (err, userData) {
		if (err) { return callback(err, null); }
		if(!userData) { return callback(null, null); }

		userData = userData[0];

		var index = userData.favorites.indexOf(Number(eventID));
		if (index === -1) {
			return callback("User: Event is not in user's favorite list", null);
		}
		userData.favorites.splice(index, 1);

		userData.save(function (err, newUser) {
			if(err) {
				console.log(err);
				return callback(err, null);
			}
			return callback(null, newUser)
		});
	}).limit(1);
}

function _showUserFavs (user, page, limit, callback){
	User.find({id: Number(user)}, function (err, userData) {
		if (err) { return callback(err, null); }
		if(!userData) { return callback(null, null); }

		userData = userData[0];

		return callback(null, userData.favorites);

	}).skip((page)*limit).limit(limit).sort({"duration.start": 1});
}


function add (req, res) {
	var user = req.user;
	var eventID = req.params.id;

	_addFavToUser(user, eventID, function (err, userRes) {
		if (err){ return _handleError(res, err); }
		if (!userRes){ return res.send(500); }

		_addFavToEvent(user, eventID, function (err, eventRes) {
			if (err){ return _handleError(res, err); }
			if (!eventRes){ return res.send(500); }
			return res.json(200, eventRes);
		});
	});
}

function remove (req, res) {
	var user = req.user;
	var eventID = req.params.id;

	_removeFavFromUser(user, eventID, function (err, userRes) {
		if (err){ return _handleError(res, err); }
		if (!userRes){ return res.send(500); }

		_removeFavFromEvent(user, eventID, function (err, eventRes) {
			if (err){ return _handleError(res, err); }
			if (!eventRes){ return res.send(500); }
			return res.json(200, eventRes);
		});
	});
}

function list (req, res) {
//	var user = req.user;
	var userId = req.params.uid;
	var page = req.query.page || gConfig.pagination.defaultPage;
	var limit = req.query.limit || gConfig.pagination.defaultLimit;

	if (limit > gConfig.pagination.maxLimit){
		limit = gConfig.pagination.maxLimit;
	}

	_showUserFavs(userId, page, limit, function (err, userFavs) {
		if (err){ return _handleError(res, err); }
		if (!userFavs){ return res.send(500); }
		return res.json(200, userFavs);
	});

}

function _handleError(res, err) {
	return res.send(500, err);
}

module.exports = {
	add: add,
	remove: remove,
	list: list
}
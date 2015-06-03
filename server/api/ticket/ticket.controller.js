'use strict';

var _ 		= require('lodash'),
	User 	= require('../user/user.model.js'),
	Event 	= require('../event/event.model.js'),
	gConfig 	= require('../../config/global-variables.js');




function _addTicket (userID, eventID, ticketID, callback) {
	Event.find({id: Number(eventID)}, function (err, eventData){
		if (err) { return callback(err); }
		if(!eventData) { return callback(null,null) }

		eventData = eventData[0];

		var ticketIndex = eventData.tickets.map(function (obj){ return obj.id }).indexOf(ticketID);
		if (ticketIndex == -1){
			return callback("Event: The ticket doesnt exists", null);
		}

		_addTicketToUser(userID, eventData.tickets[ticketIndex], function (err, newUser) {
			if (err) { return callback(err); }
			if(!newUser) { return callback(null,null) }

			// TODO
			// add to event Participants list
			// remove old participate system
		});
	}).limit(1);
}




function _addTicketToUser(userID, newTicket, callback){
	User.find({id: Number(userID)}, function (err, userData){
		if (err) { return callback(err); }
		if(!userData) { return callback(null,null) }

		userData = userData[0];

		var index = userData.tickets.map(function (obj){ return obj.eid }).indexOf(eventID);
		if (index !== -1){
			return callback("User: You already hava a ticket for that event", null);
		}

		userData.push();

		userData.save(function (err, newUser) {
			if(err) {
				console.log(err);
				return callback(err, null);
			}
			return callback(null, newUser)
		});

	}).limit(1);
}

function buy (res, req) {
	// TODO
	var user = req.user;
	var eventID = req.params.eid;
	var ticketID = req.body.tid;

	return res.send(500);
}

function cancel (res, req) {
	// TODO
	return res.send(500);
}

function revert (res, req) {
	// TODO
	return res.send(500);
}

function _showUserTickets (user, page, limit, callback){
	User.find({id: Number(user)}, function (err, userData) {
		if (err) { return callback(err, null); }
		if(!userData) { return callback(null, null); }

		userData = userData[0];

		return callback(null, userData.tickets);

	}).skip((page)*limit).limit(limit).sort({"info.date": 1});
}

function list (req, res) {
	var user = req.user;
	var page = req.query.page || gConfig.pagination.defaultPage;
	var limit = req.query.limit || gConfig.pagination.defaultLimit;

	if (limit > gConfig.pagination.maxLimit){
		limit = gConfig.pagination.maxLimit;
	}

	_showUserTickets(user.id, page, limit, function (err, userTickets) {
		if (err){ return _handleError(res, err); }
		if (!userTickets){ return res.send(500); }
		return res.json(200, userTickets);
	});
}


function _handleError(res, err) {
	return res.send(500, err);
}

module.exports = {
	buy: buy,
	cancel: cancel,
	revert: revert,
	list: list
}
'use strict';

var _ 		= require('lodash'),
	User 	= require('../user/user.model.js'),
	Event 	= require('../event/event.model.js'),
	gConfig 	= require('../../config/global-variables.js');


function _addTicket(user, eventID, ticketID, callback){

	// TODO if you have a cancelled ticket activate it.

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

		var ticketIndex = eventData.tickets.map(function (obj){ return obj.id }).indexOf(ticketID);
		if (ticketIndex == -1){
			return callback("Event: The ticket doesnt exists", null);
		}

		var particpantIndex = eventData.participants.map(function (obj){ return obj.id }).indexOf(user.id);
		if (particpantIndex !== -1){
			return callback("Event: The user is already participating", null);
		}

		newParticipant.tid = ticketID;

		eventData.participants.push(newParticipant);

		User.find({id: user.id}, function (err, userData) {
			if (err) { return callback(err, null); }
			if(!userData) { return callback(null, null); }

			userData = userData[0];

			var index = userData.tickets.map(function (obj){ return obj.id }).indexOf(eventID);
			if (index !== -1){
				return callback("User: Event is already in user", null);
			}

			userData.tickets.push({
				eid: eventID,
				tid: ticketID,
				info: {
					duration: {
						start: eventData.duration.start,
						end: eventData.duration.end
					},
				price: eventData.tickets[ticketIndex].price,
				category: eventData.tickets[ticketIndex].category
				}
			});

			eventData.save(function (err, doc) {
				if(err) {
					console.log(err);
					return callback(err, null);
				}
				userData.save(function (err, newUser) {
					if(err) {
						console.log(err);
						return callback(err, null);
					}
					return callback(null, newParticipant);
				});
			});
		}).limit(1);

			return callback(null, newParticipant);
	}).limit(1);


}


function _cancelTicket(user, eventID, callback) {
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

		User.find({id: user.id}, function (err, userData) {
			if (err) { return callback(err, null); }
			if(!userData) { return callback(null, null); }

			userData = userData[0];

			userData.tickets.forEach(function(ticketData, ticketIndex){
				// TODO cancel some
				if (ticketData.eid == eventID && ticketData.status > 0) {
					userData.tickets[ticketIndex].status = 0;
				}
			});

			eventData.save(function (err, newEvent) {
				if(err) {
					console.log(err);
					return callback(err, null);
				}

				userData.save(function (err, newUser) {
					if(err) {
						console.log(err);
						return callback(err, null);
					}
					return callback(null, newEvent.participants);
				});
			});
		}).limit(1);
	}).limit(1);
}

function buy (req, res) {
	// TODO
	var user = req.user;
	var eventID = req.params.eid;
	var ticketID = req.body.tid;

	console.log(eventID);
	console.log(ticketID);
	_addTicket(user, eventID, ticketID, function (err, newTicket){
		if (err){ return _handleError(res, err); }
		if (!newTicket){ return res.send(500); }
		return res.json(200, newTicket);
	});

}

function cancel (req, res) {
	var user = req.user;
	var eventID = req.params.eid;
	var ticketID = req.body.tid;

	_cancelTicket(user, eventID, function (err, newTicket){
		if (err){ return _handleError(res, err); }
		if (!newTicket){ return res.send(500); }
		return res.json(200, newTicket);
	});
}

function revert (req, res) {
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
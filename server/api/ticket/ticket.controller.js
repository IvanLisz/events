'use strict';

var _ 		= require('lodash'),
	User 	= require('../user/user.model.js'),
	Event 	= require('../event/event.model.js'),
	gConfig = require('../../config/global-variables.js');


function _addTicket(user, eventID, ticketID, extraUsers, callback){

	// TODO if you have a cancelled ticket activate it.

	Event.find({id: eventID}, function (err, eventData) {
		if (err) { return callback(err); }
		if(!eventData) { return callback(null,null) }

		eventData = eventData[0];


		if(eventData.quota.limit != -1 && eventData.participants.length >= eventData.quota.limit){ return callback("quota limit", null) };
		var ticketIndex = eventData.tickets.map(function (obj){ return obj.id }).indexOf(ticketID);

		if (ticketIndex == -1){
			return callback("Event: The ticket doesnt exists", null);
		}

		var particpantIndex = eventData.participants.map(function (obj){ return obj.id }).indexOf(user.id);
		if (particpantIndex !== -1){
			return callback("Event: The user is already participating", null);
		}

		var tmpParticipant = {
			id: user.id,
			name: user.name,
			picture: user.picture,
			role: "guest",
			linkedWith: user.id,
			tid: ticketID
		};

		var newParticipant = _clone(tmpParticipant);


		eventData.participants.push(tmpParticipant);


		User.find({id: user.id}, function (err, userData) {
			if (err) { return callback(err, null); }
			if(!userData) { return callback(null, null); }

			userData = userData[0];

			var index = userData.tickets.map(function (obj){ return obj.id }).indexOf(eventID);
			if (index !== -1){
				return callback("User: Event is already in user", null);
			}

			var ticketData = {
				eid: eventID,
				tid: ticketID,
				info: {
					duration: {
						start: eventData.duration.start,
						end: eventData.duration.end
					},
					price: eventData.tickets[ticketIndex].price,
					category: eventData.tickets[ticketIndex].category
				},
				linkedWith: user.id
			};

			ticketData.participantID = eventData.participants[eventData.participants.length - 1]._id;

			userData.tickets.push(ticketData); //user ticket

			_updateUserTickets(extraUsers, ticketData, tmpParticipant, userData, eventData, 0, function (err){
				if(err){
					console.log(err);
					return callback(err, null);
				}

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
				
			});


		}).limit(1);

	}).limit(1);


}

function _updateUserTickets (extraUsers, ticketData, tmpParticipant, userData, eventData, index, callback) {
	if (!extraUsers || !ticketData || !tmpParticipant || !userData || !eventData || index >= extraUsers.length) {
		callback();
		return;
	}

	tmpParticipant.id = extraUsers[index].id;
	tmpParticipant.name = extraUsers[index].name;
	tmpParticipant.picture = extraUsers[index].picture;

	eventData.participants.push(tmpParticipant);
	ticketData.participantID = eventData.participants[eventData.participants.length - 1]._id;



	if (extraUsers[index].id > -1){
		User.find({id: extraUsers[index].id}, function (err, extraData) {
			extraData = extraData[0];

			extraData.tickets.push(ticketData);
			extraData.save(function (err, doc) {
				if(err) {
					console.log(err);
					return callback(err, null);
				}
				_updateUserTickets(extraUsers, ticketData, tmpParticipant, userData, eventData, index + 1, callback);
			});

		}).limit(1);
				
	} else {
		userData.tickets.push(ticketData);
		_updateUserTickets(extraUsers, ticketData, tmpParticipant, userData, eventData, index + 1, callback);
	}
}


function _cancelTicket(user, eventID, cancelUsers, callback) {
	if(!eventID || !user || !cancelUsers){
		return callback({err: "not valid ddata"}, null);
	}

	Event.find({id: eventID}, function (err, eventData) {
		if (err) { return callback(err); }
		if(!eventData) { return callback(null,null) }

		eventData = eventData[0];


		User.find({"tickets": { $elemMatch: { linkedWith: user.id, eid: eventID, status: { $gt: 0 } } } }, function (err, usersData) {
			if (err) { return callback(err, null); }
			if(!usersData) { return callback({err: "No tickets"}, null); }

			_removeParticipants(user, cancelUsers, eventData, 0, function (err){
				if(err){
					console.log(err);
					return callback(err, null);
				}

				_cancelUserTicket(cancelUsers, usersData, 0, function (err){
					if(err){
						console.log(err);
						return callback(err, null);
					}	
					eventData.save(function (err, newEvent) {
						if(err) {
							console.log(err);
							return callback(err, null);
						}

						console.log("SENDING DATA");
						return callback(null, "OK")//usersData[usersData.map(function (obj){return obj.id}).indexOf(user.id)].tickets);

					});
				});
			});
		});//.limit(100);
	}).limit(1);
}

function _removeParticipants (user, cancelUsers, eventData, index, callback){
	if (!user || !cancelUsers || !eventData){
		callback({err: "_removeParticipants"});
		return;
	}

	if(index >= cancelUsers.length){
		callback();
		return;
	}

	var participantIndex = eventData.participants.map(function (obj){ return String(obj._id) }).indexOf(cancelUsers[index]);

	if (participantIndex == -1){
		return callback({err: "Event: user isnt participating"});
	} else {
		eventData.participants.splice(participantIndex, 1);
		_removeParticipants (user, cancelUsers, eventData, index + 1, callback);
	}

}

function _cancelUserTicket(cancelUsers, usersData, index, callback) {
	if (!cancelUsers || !usersData){
		callback({err: "_cancelUserTicket"});
		return;
	}

	if(index >= cancelUsers.length){
		callback();
		return;
	}

	var arrUpdates = [];
	usersData.forEach(function (userData, uindex) {
		userData.tickets.forEach(function (ticketData){
				if (ticketData.participantID == cancelUsers[index] && ticketData.status > 0){
					console.log("Cancelling");
					ticketData.status = 0;
					arrUpdates.push(uindex);
				}
		});
	});

	_canceluserSave(usersData, arrUpdates, 0, function(){
		_cancelUserTicket(cancelUsers, usersData, index + 1, callback);
	});
}

function _canceluserSave(usersData, updateIds, index, callback){
	if(index >= updateIds.length){
		callback();
		return;
	}

	usersData[updateIds[index]].save(function (err, newUsers) {
		if(err) {
			return callback(err, null);
		}
		_canceluserSave(usersData, updateIds, index + 1, callback);
	});
}

function buy (req, res) {
	console.log(req.body);
	// TODO
	var user = req.user;
	var eventID = req.params.eid;
	var ticketID = req.body.tid;

	/*var defExtras = [{
		id: 1, // if friendlisted then the ticket will be able at friends profile 
		name: "Ramon Jamon",
		picture: "?",
			
	},{
		id: -1,  // if friendlisted then the ticket will be able at friends profile 
		name: "Jorgito",
		picture: "?",
			
	}];*/

	var extras = req.body.extras || null;

	_addTicket(user, eventID, ticketID, extras, function (err, newTicket){
		if (err){ return _handleError(res, err); }
		if (!newTicket){ return res.send(500); }
		return res.json(200, newTicket);
	});

}

function cancel (req, res) {
	var user = req.user;
	var eventID = req.params.eid;
	var cancelTickets = req.body.cancelIds;

	console.log(req.params);
	console.log(req.body);


	_cancelTicket(user, eventID, cancelTickets, function (err, newTicket){
		if (err){ return _handleError(res, err); }
		if (!newTicket){ return res.send(500); }
		
		console.log("FINISH");
		//console.log(newTicket);
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


function _clone (obj) {
	return JSON.parse(JSON.stringify(obj));
};

module.exports = {
	buy: buy,
	cancel: cancel,
	revert: revert,
	list: list
}
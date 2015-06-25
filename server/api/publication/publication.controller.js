'use strict';

var _ 		= require('lodash'),
	Event 	= require('../event/event.model.js'),
	gConfig 	= require('../../config/global-variables.js');



/*
function _findUserAccounts(id, service){

}
*/


function _showPublications(eventID, callback){
	Event.find({ id: eventID }, function (err, eventData){
		if (err) { return callback(err, null); }
		if(!eventData) { return callback(null, null); }

		eventData = eventData[0];

		return callback(null, eventData.publications)

	}).limit(1)
}


function _removePost(eventID, publicationID, callback){
	Event.find({id: eventID}, function(err, eventData){
		if (err) { return callback(err, null); }
		if(!eventData) { return callback(null, null); }
		eventData = eventData[0];


		var index = eventData.publications.map(function (obj){return String(obj._id) }).indexOf(publicationID);
		if (index === -1) {
			return callback("Event: Publications is not in event", null);
		}
		
		if(user.id != eventData.creator.id && user.id != eventData.publications[index].uid){
			return callback("Event: Cant remove. Not admin or creator of post.", null);
		}
		
		eventData.publications.splice(index, 1);

		eventData.save(function (err, newEvent) {
			if(err) {
				console.log(err);
				return callback(err, null);
			}
			return callback(null, newEvent)
		});

	});
}


function _addPost(eventID, user, publication, callback){
	publication = {x: 1}
	Event.update({id: eventID}, {$push: { 'pubications': publication }}, function(err, newEvent){
		if (err) { return callback(err, null); }
		if(!newEvent) { return callback(null, null); }
		return callback(null, newEvent);
	})
}


function post(req, res){
	var user = req.user;
	var eventID = req.params.eid;

	var publication = req.query.publication; 
	
	_addPost(eventID, user, publication, function(err, newPost){
		if (err){ return _handleError(res, err); }
		if (!newPost){ return res.send(500); }
		return res.json(200, newPost);
	});
}

function remove (req, res) {
	var user = req.user;
	var eventID = req.params.eid;
	var publicationID = req.query.pid; //publicationID

	_removePost(eventID, publicationID, function (err, removeResponse){
		if (err){ return _handleError(res, err); }
		if (!removeResponse){ return res.send(500); }
		return res.json(200, removeResponse);
	});

}

function list (req, res) {
	var eventID = req.params.eid;
	
	_showPublications(eventID, function (err, publicationsData) {
		if (err){ return _handleError(res, err); }
		if (!publicationsData){ return res.send(500); }
		return res.json(200, publicationsData);
	});

}

function _handleError(res, err) {
	return res.send(500, err);
}

module.exports = {
	post: post,
	remove: remove,
	list: list
}
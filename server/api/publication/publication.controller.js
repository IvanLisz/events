'use strict';

var _ 		= require('lodash'),
	User 	= require('../user/user.model.js'),
	Event 	= require('../event/event.model.js'),
	gConfig 	= require('../../config/global-variables.js');



function _findUserAccounts(id, service){

}

function block(req,res){

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
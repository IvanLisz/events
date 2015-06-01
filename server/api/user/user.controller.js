'use strict';

var User 		= require('./user.model'),
	passport 	= require('passport'),
	config 		= require('../../config/environment'),
	jwt 		= require('jsonwebtoken'),
	gConfig 	= require('../../config/global-variables.js');


var validationError = function(res, err) {
	return res.json(422, err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
function index (req, res) {
	User.find({}, '-salt -hashedPassword', function (err, users) {
		if(err) return res.send(500, err);
		res.json(200, users);
	});
};

/**
 * Creates a new user
 */
function create (req, res, next) {
	var newUser = new User(req.body);
	newUser.provider = 'local';
	newUser.role = 'user';
	newUser.save(function(err, user) {
		if (err) return validationError(res, err);
		var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
		res.json({ token: token });
	});
};

/**
 * Get a single user
 */
function show (req, res, next) {
	var userId = req.params.id;

	User.findById(userId, function (err, user) {
		if (err) return next(err);
		if (!user) return res.send(401);
		res.json(user.profile);
	});
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
function destroy (req, res) {
	User.findByIdAndRemove(req.params.id, function(err, user) {
		if(err) return res.send(500, err);
		return res.send(204);
	});
};

/**
 * Change a users password
 */
function changePassword (req, res, next) {
	var userId = req.user._id;
	var oldPass = String(req.body.oldPassword);
	var newPass = String(req.body.newPassword);

	User.findById(userId, function (err, user) {
		if(user.authenticate(oldPass)) {
			user.password = newPass;
			user.save(function(err) {
				if (err) return validationError(res, err);
				res.send(200);
			});
		} else {
			res.send(403);
		}
	});
};

/**
 * Get my info
 */
function me (req, res, next) {
	var userId = req.user._id;
	User.findOne({
		_id: userId
	}, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
		if (err) return next(err);
		if (!user) return res.json(401);
		res.json(user);
	});
};


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

function _showUserFavs (user, eventID, page, limit, callback){
	User.find({id: user.id}, function (err, userData) {
		if (err) { return callback(err, null); }
		if(!userData) { return callback(null, null); }

		userData = userData[0];

		return callback(null, userData.favorites);

	}).skip((page)*limit).limit(limit).sort({"duration.start": 1});
}


function favAdd(req, res){
	var user = req.user;
	var eventID = req.params.id;

	_addFavToUser(user, eventID, function(err, userRes){
		if (err){ return _handleError(res, err); }
		if (!userRes){ return res.send(500); }

		_addFavToEvent(user, eventID, function(err, eventRes){
			if (err){ return _handleError(res, err); }
			if (!eventRes){ return res.send(500); }
			return res.json(200, eventRes);
		}
	});
}

function favRemove(req, res){
	var user = req.user;
	var eventID = req.params.id;

	_removeFavFromUser(user, eventID, function(err, userRes){
		if (err){ return _handleError(res, err); }
		if (!userRes){ return res.send(500); }
		
		_removeFavFromEvent(user, eventID, function(err, eventRes){
			if (err){ return _handleError(res, err); }
			if (!eventRes){ return res.send(500); }
			return res.json(200, eventRes);
		}
	});
}

function favList(req, res) {
	var user = req.user;
	var eventID = req.params.id;
	var page = req.query.page || gConfig.pagination.defaultPage;
	var limit = req.query.limit || gConfig.pagination.defaultLimit;

	if (limit > gConfig.pagination.maxLimit){
		limit = gConfig.pagination.maxLimit;
	}

	_showUserFavs(user, eventID, page, limit, function(err, userFavs{
		if (err){ return _handleError(res, err); }
		if (!userRes){ return res.send(500); }
		return res.json(200, userRes);
	});

}

/**
 * Authentication callback
 */
function authCallback (req, res, next) {
	res.redirect('/');
};



module.exports = {
	index: index,
	create: create,
	show: show,
	destroy: destroy,
	changePassword: changePassword,
	me: me,
	authCallback: authCallback,

	favList: favList,
	favRemove: favRemove,
	favAdd: favAdd
}
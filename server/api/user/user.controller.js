'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

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
	authCallback: authCallback
}
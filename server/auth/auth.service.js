'use strict';

var mongoose 	= require('mongoose'),
	passport 	= require('passport'),
	config 		= require('../config/environment'),
	jwt 		= require('jsonwebtoken'),
	expressJwt 	= require('express-jwt'),
	compose 	= require('composable-middleware'),
	User 		= require('../api/user/user.model'),
	validateJwt = expressJwt({ secret: config.secrets.session });

var expirationTime = 86400;

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated() {
	return compose()
		// Validate jwt
		.use(function(req, res, next) {
			// allow access_token to be passed through query parameter as well
			if(req.query && req.query.hasOwnProperty('access_token')) {
				req.headers.authorization = 'Bearer ' + req.query.access_token;
			}
			validateJwt(req, res, next);
		})
		// Attach user to request
		.use(function(req, res, next) {
			User.findById(req.user._id, function (err, user) {
				if (err) return next(err);
				if (!user) return res.send(401);

				req.user = user;
				next();
			});
		});
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
function hasRole(roleRequired) {
	if (!roleRequired) throw new Error('Required role needs to be set');

	return compose()
		.use(isAuthenticated())
		.use(function meetsRequirements(req, res, next) {
			if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
				next();
			}
			else {
				res.send(403);
			}
		});
}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken(id) {
	return jwt.sign({ _id: id }, config.secrets.session, { expiresInMinutes: expirationTime });
}

/**
 * Set token cookie directly for oAuth strategies
 */
function setTokenCookie(req, res) {
	if (!req.user) return res.json(404, { message: 'Something went wrong, please try again.'});
	var token = signToken(req.user._id, req.user.role);
	res.cookie('token', JSON.stringify(token));
	return {
		token: token,
		expiration: expirationTime
	};
}

function sendUser(req, res, user) {
	req.user = user;
	var cookie = setTokenCookie(req, res);
	return res.status(200).json({
		expiration: cookie.expiration,
		token: cookie.token,
		user: user
	});
}

module.exports = {
	isAuthenticated: isAuthenticated,
	hasRole: hasRole,
	signToken: signToken,
	setTokenCookie: setTokenCookie,
	sendUser: sendUser
}
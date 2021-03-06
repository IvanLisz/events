'use strict';

var express 	= require('express'),
	passport 	= require('passport'),
	auth 		= require('../auth.service');

var router = express.Router();

router
	.get('/', passport.authenticate('twitter', {
		failureRedirect: '/signup',
		session: false
	}))

	.get('/callback', passport.authenticate('twitter', {
		failureRedirect: '/signup',
		session: false
	}), auth.setTokenCookie);

module.exports = router;
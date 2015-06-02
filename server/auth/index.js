'use strict';

var express 	= require('express'),
	passport 	= require('passport'),
	config 		= require('../config/environment'),
	User 		= require('../api/user/user.model'),
	auth		= require('./auth.controller');

// Passport Configuration
require('./local/passport').setup(User, config);
require('./google/passport').setup(User, config);
require('./twitter/passport').setup(User, config);

var router = express.Router();

router.use('/local', require('./local'));
router.use('/facebook', require('./facebook'));
router.use('/twitter', require('./twitter'));
router.use('/google', require('./google'));

router
	.post('/login', auth.login);

module.exports = router;
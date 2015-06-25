'use strict';

var express 	= require('express'),
	controller 	= require('./favorite.controller'),
	config 		= require('../../config/environment'),
	auth 		= require('../../auth/auth.service');

var router = express.Router();

router.post('/post/:eid', auth.isAuthenticated(), controller.add);
router.post('/remove/:eid', auth.isAuthenticated(), controller.remove);
//router.post('/block/:eid', auth.isAuthenticated(), controller.block);
router.get('/list/:eid', controller.list);

module.exports = router;
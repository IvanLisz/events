'use strict';

var express 	= require('express'),
	controller 	= require('./favorite.controller'),
	config 		= require('../../config/environment'),
	auth 		= require('../../auth/auth.service');

var router = express.Router();

router.post('/add/:id', auth.isAuthenticated(), controller.add);
router.post('/remove/:id', auth.isAuthenticated(), controller.remove);
router.get('/list/:uid', controller.list);

module.exports = router;
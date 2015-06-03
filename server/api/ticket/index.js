'use strict';

var express 	= require('express'),
	controller 	= require('./ticket.controller'),
	config 		= require('../../config/environment'),
	auth 		= require('../../auth/auth.service');

var router = express.Router();

router.post('/buy/:eid', auth.isAuthenticated(), controller.buy);
router.post('/cancel/:eid', auth.isAuthenticated(), controller.cancel);
router.post('/revert/:eid', auth.isAuthenticated(), controller.revert);
router.get('/list', auth.isAuthenticated(), controller.list);

module.exports = router;
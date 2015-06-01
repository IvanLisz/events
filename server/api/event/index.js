'use strict';

var express		= require('express'),
	controller	= require('./event.controller'),
	config		= require('../../config/environment'),
	auth		= require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/name/:name', controller.showByName);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(),controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);
router.post('/:id/join', auth.isAuthenticated(), controller.addParticipant);
router.post('/:id/leave', auth.isAuthenticated(), controller.removeParticipant);



module.exports = router;
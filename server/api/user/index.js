'use strict';

var express 	= require('express'),
	controller 	= require('./user.controller'),
	config 		= require('../../config/environment'),
	auth 		= require('../../auth/auth.service');

var router = express.Router();

// Get list of all users
router.get('/', auth.hasRole('admin'), controller.index);

// Get the authenticated user
router.get('/me', auth.isAuthenticated(), controller.me);

// Get user profile
router.get('/:username', controller.show);

// Creates user
router.post('/', controller.create);

// Change user password
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);

// Creates user
router.post('/update', auth.isAuthenticated(), controller.update);


// Delete user
router.delete('/:id', auth.hasRole('admin'), controller.destroy);


module.exports = router;

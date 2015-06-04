'use strict';

var express 	= require('express'),
	controller = require('./badge.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);

module.exports = router;
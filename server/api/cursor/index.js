'use strict';

var express = require('express');
var controller = require('./cursor.controller');

var router = express.Router();

router.get('/:id', controller.show);
router.post('/', controller.create);
router.delete('/:id', controller.destroy);

module.exports = router;
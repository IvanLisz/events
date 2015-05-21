/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Event = require('../api/event/event.model');
var User = require('../api/user/user.model');

Event.find({}).remove(function() {
	Event.create({
		name: 'evento 1',
		description: 'evento peronista',
		picture: 'http://i0.wp.com/www.jdperon.gov.ar/wp-content/uploads/FotoBioPeronInst-e1381427876375.jpg',
		creation: 1432191191230,
		creator: {
			id: 2,
			username: 'peron'
		},
		date: 1434191191230,
		location: 'Buenos Aires, argentina'
	},

	{
		name: 'evento de poder',
		description: 'viene pele',
		picture: 'http://www.critica.com.pa/sites/default/files/imagenes/2015/05/07/peles.jpg',
		creation: 1432191191230,
		creator: {
			id: 1,
			username: 'pele'
		},
		date: 1435191191230,
		location: 'Buenos Aires, Argentina'
	});
});

User.find({}).remove(function() {
	User.create({
		provider: 'local',
		name: 'Test User',
		email: 'test@test.com',
		password: 'test'
	}, {
		provider: 'local',
		role: 'admin',
		name: 'Admin',
		email: 'admin@admin.com',
		password: 'admin'
	}, function() {
			console.log('finished populating users');
		}
	);
});
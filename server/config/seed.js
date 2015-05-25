/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Event = require('../api/event/event.model');
var User = require('../api/user/user.model');

Event.find().remove(function() {
	createSeed(Event, [
	{
		name: 'evento dentro de un tiempo',
		description: 'evento peronista',
		picture: 'http://i0.wp.com/www.jdperon.gov.ar/wp-content/uploads/FotoBioPeronInst-e1381427876375.jpg',
		creator: {
			id: 2,
			username: 'peron'
		},
		duration: {start: Date.now() + 3600000, end: Date.now() + 86400000},
		location: 'Buenos Aires, Argentina'
	},
	{
		name: 'evento dentro de mas tiempo',
		description: 'evento peronista',
		picture: 'http://i0.wp.com/www.jdperon.gov.ar/wp-content/uploads/FotoBioPeronInst-e1381427876375.jpg',
		creator: {
			id: 2,
			username: 'peron'
		},
		duration: {start: Date.now() + 3600000 * 2, end: Date.now() + 96400000},
		location: 'Buenos Aires, Argentina'
	},
	{
		name: 'evento ahora',
		description: 'evento peronista',
		picture: 'http://i0.wp.com/www.jdperon.gov.ar/wp-content/uploads/FotoBioPeronInst-e1381427876375.jpg',
		creator: {
			id: 2,
			username: 'peron'
		},
		duration: {start: Date.now(), end: Date.now() + 3600000},
		location: 'Buenos Aires, Argentina'
	},
	{
		name: 'evento viejo',
		description: 'viene pele',
		picture: 'http://www.critica.com.pa/sites/default/files/imagenes/2015/05/07/peles.jpg',
		creator: {
			id: 1,
			username: 'pele'
		},
		duration: {start: Date.now()- 86400000 * 3 , end: Date.now() - 86400000 },
		location: 'Buenos Aires, Argentina'
	},
	{
		name: 'evento mas viejo',
		description: 'viene pele',
		picture: 'http://www.critica.com.pa/sites/default/files/imagenes/2015/05/07/peles.jpg',
		creator: {
			id: 1,
			username: 'pele'
		},
		duration: {start: Date.now()- 86400000 * 4, end: Date.now() - 86400000 * 2},
		location: 'Buenos Aires, Argentina'
	}
	])
});

User.find({}).remove(function() {
	createSeed(User, [
	{
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
	}, {
		provider: 'local',
		role: 'admin',
		name: 'a',
		email: 'a@a.com',
		password: 'a'
	}
	]);
});

function createSeed (database, seeds, index) {
	if (!index) {
		index = 0;
	}
	console.log(index);
	console.log(seeds.length);
	if (index >= seeds.length) {
		return;
	}
	database.create(seeds[index]);
	setTimeout(function() {
		createSeed(database, seeds, index+1);
	}, 100);
}
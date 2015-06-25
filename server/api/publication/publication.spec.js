'use strict';

var should 	= require('should'),
	app 	= require('../../app'),
	request = require('supertest');

describe('GET /api/favs', function() {

	it('should respond with JSON array', function(done) {
		request(app)
			.get('/api/favs')
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function(err, res) {
				if (err) return done(err);
				res.body.should.be.instanceof(Array);
				done();
			});
	});
});

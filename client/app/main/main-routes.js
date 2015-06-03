'use strict';

angular.module('events.main')
.config(function ($stateProvider) {
	$stateProvider
	.state('main', {
		url: '/',
		template: '<main-page events="events"></main-page>'
	});
});
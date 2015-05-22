'use strict';

angular.module('events.landing')
.config(function ($stateProvider) {
	$stateProvider
	.state('main', {
		url: '/',
		template: '<landing-page></landing-page>'
	});
});
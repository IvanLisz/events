'use strict';

angular.module('events.landing')
.config(function ($stateProvider) {
	$stateProvider
	.state('landing', {
		url: '/',
		template: '<landing-page></landing-page>'
	});
});
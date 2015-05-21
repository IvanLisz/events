'use strict';

angular.module('events')
.config(function ($stateProvider) {
	$stateProvider
	.state('main', {
		url: '/',
		template: '<landing-page></landing-page>'
	});
});
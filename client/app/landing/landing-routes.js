'use strict';

angular.module('events.landing')
.config(function ($stateProvider) {
	$stateProvider
	.state('landing', {
		url: '/',
		template: '<landing-page events="events"></landing-page>',
		controller: ['$scope', 'Events', function ($scope, Events){
			$scope.events = Events;
		}],
		resolve: {
			Events: ['Event', function(Event) {
				Event.get();
			}]
		}
	});
});
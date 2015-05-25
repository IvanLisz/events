'use strict';

angular.module('events.event')
.config(function ($stateProvider) {

	$stateProvider
	.state('event', {
		url: '/event/:id',
		template: '<event-page event="::event"></event-page>',
		controller: ['$scope', '$state', 'Auth', 'Event', function ($scope, $state, Auth, Event) {
			$scope.event = Event;
		}],
		resolve: {
			Event: ['$stateParams', 'Event', function ($stateParams, Event) {
				return Event.search($stateParams.id);
			}]
		}
	});
});
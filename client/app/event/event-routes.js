'use strict';

angular.module('events.event')
.config(function ($stateProvider) {

	checkParticipation.$inject = ['$state', 'Auth'];
	function checkParticipation ($state, Auth) {
		debugger;
	}

	getEvent.$inject = ['$stateParams', 'Event'];
	function getEvent ($stateParams, Event) {
		return Event.get($stateParams.id);
	}

	$stateProvider
	.state('event', {
		url: '/event/:id',
		template: '<event-public-page event="::event" participation="::participation"></event-public-page>',
		controller: ['$scope', '$state', 'Auth', 'Event', function ($scope, $state, Auth, Event) {
			$scope.event = Event;
			$scope.participation = Auth.getUserInEventStatus(Number($state.params.id)) || {};
		}],
		resolve: {
			Event: getEvent
		}
	})

	.state('event.private', {
		url: '',
		template: '<event-private-page></event-private-page>',
	});
});
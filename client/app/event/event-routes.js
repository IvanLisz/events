'use strict';

angular.module('events.event')
.config(function ($stateProvider) {

	checkParticipation.$inject = ['$state', 'Auth'];
	function checkParticipation ($state, Auth) {
		var userParticipation = Auth.getUserInEventStatus($state.params.id);
		if (userParticipation) {
			$state.go('event.private');
		}
		return userParticipation;
	}

	getEvent.$inject = ['$stateParams', 'Event'];
	function getEvent ($stateParams, Event) {
		return Event.get($stateParams.id);
	}

	$stateProvider
	.state('event', {
		url: '/event/{id}',
		template: '<event-public-page event="::event"></event-public-page>',
		controller: ['$scope', 'Event', function ($scope, Event) {
			$scope.event = Event;
		}],
		resolve: {
			Participation: checkParticipation,
			Event: getEvent
		},
	})

	.state('event.private', {
		url: '',
		template: '<event-private-page></event-private-page>',
	});
});
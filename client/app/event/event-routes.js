'use strict';

angular.module('events.event')
.config(function ($stateProvider) {

	participation.$inject = ['$state', 'Auth'];

	function participation ($state, Auth) {
	}

	$stateProvider
	.state('event', {
		url: '/event/{id}',
		template: '<event-public-page></event-public-page>',
		resolve: {
			Participation: ['$state', 'Auth', function ($state, Auth) {
				var userParticipation = Auth.getUserInEventStatus($state.params.id);
				if (userParticipation) {
					$state.go('event.private');
				}
				return userParticipation;
			}]
		},
	})

	.state('event.private', {
		url: '',
		template: '<event-private-page></event-private-page>',
	});
});
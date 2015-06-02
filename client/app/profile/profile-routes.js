'use strict';

angular.module('events.profile')
.config(function ($stateProvider) {

	$stateProvider
	.state('profile', {
		url: '/profile/@:username',
		template: '<profile-public-page profile="::profile"></profile-public-page>',
		controller: ['$scope', '$state', 'Auth', 'Profile', function ($scope, $state, Auth, Profile) {
			$scope.profile = Profile;
		}],
		resolve: {
			Profile: ['$stateParams', 'Profile', function ($stateParams, Profile) {
				return Profile.search($stateParams.username);
			}]
		}
	});
});
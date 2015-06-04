'use strict';

angular.module('events.profile')
.config(function ($stateProvider) {

	$stateProvider
	.state('profile', {
		url: '/@{username}',
		template: '<profile-public-page profile="::profile" badges="::badges"></profile-public-page>',
		controller: ['$scope', '$state', 'Auth', 'Profile', 'Badges', function ($scope, $state, Auth, Profile, Badges) {
			$scope.profile = Profile;
			$scope.badges = Badges;
		}],
		resolve: {
			Profile: ['$stateParams', 'Profile', function ($stateParams, Profile) {
				return Profile.get($stateParams.username);
			}]
		}
	});
});
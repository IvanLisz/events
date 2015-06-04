'use strict';

angular.module('events', [
	'ipCookie',
	'ngResource',
	'ngSanitize',
	'ngMaterial',
	'btford.socket-io',
	'ui.router',

	// Pages
	'events.auth',
	'events.common',
	'events.login',
	'events.main',
	'events.event',
	'events.navbar',
	'events.profile',
	'events.badges',

	//Thirdparty
	'infinite-scroll',
	'facebook'
])
	.config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
		$urlRouterProvider
			.otherwise('/');
		$httpProvider.defaults.useXDomain = true;
		delete $httpProvider.defaults.headers.common['X-Requested-With'];
		$locationProvider.html5Mode(true);
		$httpProvider.interceptors.push('authInterceptor');
	})

	.factory('authInterceptor', function ($rootScope, $q, ipCookie, $location, $injector) {
		return {
			// Add authorization token to headers
			request: function (config) {
				config.headers = config.headers || {};
				if (ipCookie('token')) {
					config.headers.Authorization = 'Bearer ' + ipCookie('token');
				}
				return config;
			}
		};
	})

	.run(function ($rootScope, $location, Auth, Login, ipCookie, $q) {
		$rootScope.$on('$stateChangeError',
		function(event, toState, toParams, fromState, fromParams, error){
			if (!error) {
				return $q.reject();
			}
			if (error.status === 401) {
				Login.show();
				// remove any stale tokens
				ipCookie.remove('token');
				return $q.reject(error);
			}
			return $q.reject(error);
		});

		// Redirect to login if route requires auth and you're not logged in
		$rootScope.$on('$stateChangeStart', function (event, next) {
			Auth.isLoggedIn(function(loggedIn) {
				if (next.authenticate && !loggedIn) {
					$location.path('/login');
				}
			});
		});
	});

// Modules
angular.module('events.auth', ['events', 'facebook']);
angular.module('events.common', ['events']);
angular.module('events.login', ['events']);
angular.module('events.main', ['events']);
angular.module('events.event', ['events']);
angular.module('events.navbar', ['events']);
angular.module('events.profile', ['events']);
angular.module('events.badges', ['events']);

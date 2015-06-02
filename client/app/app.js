'use strict';

angular.module('events', [
	'ngCookies',
	'ngResource',
	'ngSanitize',
	'ngMaterial',
	'btford.socket-io',
	'ui.router',

	// Pages
	'events.common',
	'events.login',
	'events.landing',
	'events.event',
	'events.navbar',

	//Thirdparty
	'infinite-scroll'
])
	.config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
		$urlRouterProvider
			.otherwise('/');
		$httpProvider.defaults.useXDomain = true;
		delete $httpProvider.defaults.headers.common['X-Requested-With'];
		$locationProvider.html5Mode(true);
		//$httpProvider.interceptors.push('authInterceptor');
	})

	.factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location, $injector) {
		return {
			// Add authorization token to headers
			request: function (config) {
				config.headers = config.headers || {};
				if ($cookieStore.get('token')) {
					config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
				}
				return config;
			},

			// Intercept 401s and redirect you to login
			responseError: function(response) {
				if(response.status === 401) {
					$injector.invoke(function ($http, Login) {
						Login.show();
					});
					// remove any stale tokens
					$cookieStore.remove('token');
					return $q.reject(response);
				}
				else {
					return $q.reject(response);
				}
			}
		};
	})

	.run(function ($rootScope, $location, Auth, Login, $cookieStore, $q) {
		$rootScope.$on('$stateChangeError',
		function(event, toState, toParams, fromState, fromParams, error){

			if(error.status === 401){
				Login.show();
				// remove any stale tokens
				$cookieStore.remove('token');
				return $q.reject(error);
			}
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
angular.module('events.common', ['events']);
angular.module('events.login', ['events']);
angular.module('events.landing', ['events']);
angular.module('events.event', ['events']);
angular.module('events.navbar', ['events']);

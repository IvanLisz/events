(function(){
	'use strict';

	angular
		.module('events.login')
		.directive('evLoginModal', evLoginModalDirective);

	/**
	 * @ngdoc directive
	 * @name events.login.directive:evLoginModal
	 * @restrict E
	 * @scope
	 *
	 * @description
	 * TODO: A description of the directive
	 *
	 * @param {object}  field   TODO: describe attributes to the directive
	 *
	 */

	evLoginModalDirective.$inject = [];

	function evLoginModalDirective () {
		return {
			restrict: 'E',
			templateUrl: 'app/account/login/login.html',
			scope: {},
			controller: evLoginModalController,
			controllerAs: 'ctrl',
			bindToController: true,
			require: 'evLoginModal',
			link: link
		};

		function link (scope, elm, attr, ctrl) {

		}
	}

	evLoginModalController.$inject = ['Auth', '$window'];

	function evLoginModalController (Auth, $window) {
		/*jshint validthis:true */

		/*
		var ctrl = this;

		ctrl.user = {};
		ctrl.errors = {};

		ctrl.login = function(form) {
			ctrl.submitted = true;

			if(form.$valid) {
				Auth.login({
					email: ctrl.user.email,
					password: ctrl.user.password
				})
				.then( function() {
					// Logged in, redirect to home
					$location.path('/');
				})
				.catch( function(err) {
					ctrl.errors.other = err.message;
				});
			}
		};

		ctrl.loginOauth = function(provider) {
			$window.location.href = '/auth/' + provider;
		};
*/
	}
})();
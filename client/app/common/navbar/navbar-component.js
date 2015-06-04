(function(){
	'use strict';

	angular
		.module('events.navbar')
		.directive('evNavbar', evNavbarDirective);

	/**
	 * @ngdoc directive
	 * @name events.navbar.directive:evNavbar
	 * @restrict E
	 * @scope
	 *
	 * @description
	 * TODO: A description of the directive
	 *
	 * @param {object}  field   TODO: describe attributes to the directive
	 *
	 */

	evNavbarDirective.$inject = ['Auth'];

	function evNavbarDirective (Auth) {
		return {
			restrict: 'E',
			templateUrl: 'app/common/navbar/navbar.html',
			scope: {},
			controller: evNavbarController,
			controllerAs: 'ctrl',
			bindToController: true,
			require: 'evNavbar',
			link: link
		};

		function link (scope, elm, attr, ctrl) {

			Auth.onUserChange(function (user) {
				console.log('change');
				ctrl.user = user;
			}).disposeOnDestroy(scope);
		}
	}

	evNavbarController.$inject = ['$state', 'Login', 'Auth'];

	function evNavbarController ($state, Login, Auth) {
		/*jshint validthis: true */
		var ctrl = this;
		ctrl.user = {};
		Auth.getCurrentUser().then(function (user) {
			ctrl.user = user;
		});
		ctrl.goToProfile = function () {
			if (!ctrl.user.id) {
				return Login.show();
			}
			$state.go('profile', {username: ctrl.user.username});
		};
	}
})();
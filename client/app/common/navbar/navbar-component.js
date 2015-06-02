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

	evNavbarDirective.$inject = [];

	function evNavbarDirective () {
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

		}
	}

	evNavbarController.$inject = ['$state', 'Auth', 'Login'];

	function evNavbarController ($state, Auth, Login) {
		/*jshint validthis: true */
		var ctrl = this;

		ctrl.goToProfile = function () {
			Auth.getCurrentUser().then(function (user){
				if (!user.id) {
					return Login.show();
				}
				$state.go('profile', {username: user.username});
				console.log(user);
			});
		};
	}
})();
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

	evNavbarController.$inject = ['$state', 'Event'];

	function evNavbarController ($state, Event) {
		/*jshint validthis: true */
		var ctrl = this;
	}
})();
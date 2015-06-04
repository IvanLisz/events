(function(){
	'use strict';

	angular
		.module('events.badges')
		.directive('evBadge', evBadgeDirective);

	/**
	 * @ngdoc directive
	 * @name events.badges.directive:evBadge
	 * @restrict E
	 * @scope
	 *
	 * @description
	 * TODO: A description of the directive
	 *
	 * @param {object}  field   TODO: describe attributes to the directive
	 *
	 */

	evBadgeDirective.$inject = [];

	function evBadgeDirective () {
		return {
			restrict: 'E',
			templateUrl: 'app/common/badges/ev-badge.html',
			scope: {
				badge: '='
			},
			controller: angular.noop,
			controllerAs: 'ctrl',
			bindToController: true
		};
	}

})();
(function(){
	'use strict';

	angular
		.module('events.badges')
		.directive('evUserBadges', evUserBadgesDirective);

	/**
	 * @ngdoc directive
	 * @name events.badges.directive:evUserBadges
	 * @restrict E
	 * @scope
	 *
	 * @description
	 * TODO: A description of the directive
	 *
	 * @param {object}  field   TODO: describe attributes to the directive
	 *
	 */

	evUserBadgesDirective.$inject = [];

	function evUserBadgesDirective () {
		return {
			restrict: 'E',
			templateUrl: 'app/common/badges/ev-user-badges.html',
			scope: {
				badges: '=',
				unlocked: '=?'
			},
			controller: evUserBadgesController,
			controllerAs: 'ctrl',
			bindToController: true
		};
	}

	evUserBadgesController.$inject = ['Auth', 'Badges'];

	function evUserBadgesController (Auth, Badges) {
		/*jshint validthis: true */
		var ctrl = this;

		ctrl.unlocked.push(2);
		ctrl.unlocked.push(3);

		ctrl.isLocked = function (badge) {
			if (!ctrl.unlocked) {
				return false;
			}
			return ctrl.unlocked.indexOf(badge.id) === -1;
		}
	}
})();
(function(){
	'use strict';

	angular
		.module('events.event')
		.directive('eventPublicPage', eventPublicPageDirective);

	/**
	 * @ngdoc directive
	 * @name events.event.directive:eventPublicPage
	 * @restrict E
	 * @scope
	 *
	 * @description
	 * TODO: A description of the directive
	 *
	 * @param {object}  field   TODO: describe attributes to the directive
	 *
	 */

	eventPublicPageDirective.$inject = [];

	function eventPublicPageDirective () {
		return {
			restrict: 'E',
			templateUrl: 'app/event/event-public.html',
			scope: {},
			controller: eventPublicPageController,
			controllerAs: 'ctrl',
			bindToController: true,
			require: 'eventPublicPage',
			link: link
		};

		function link (scope, elm, attr, ctrl) {

		}
	}

	eventPublicPageController.$inject = [];

	function eventPublicPageController () {
		var ctrl = this;
	}
})();
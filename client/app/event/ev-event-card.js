(function(){
	'use strict';

	angular
		.module('events.event')
		.directive('evEventCard', evEventCardDirective);

	/**
	 * @ngdoc directive
	 * @name events.evEventCard.directive:evEventCard
	 * @restrict E
	 * @scope
	 *
	 * @description
	 * TODO: A description of the directive
	 *
	 * @param {object}  field   TODO: describe attributes to the directive
	 *
	 */

	evEventCardDirective.$inject = [];

	function evEventCardDirective () {
		return {
			restrict: 'E',
			templateUrl: 'app/event/ev-event-card.html',
			scope: {
				event: '='
			},
			controller: evEventCardController,
			controllerAs: 'ctrl',
			bindToController: true,
			require: 'evEventCard',
			link: link
		};

		function link (scope, elm, attr, ctrl) {

		}
	}

	evEventCardController.$inject = [];

	function evEventCardController () {
		var ctrl = this;

	}
})();
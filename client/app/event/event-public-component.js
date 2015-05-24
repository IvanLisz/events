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
			scope: {
				'event': '=',
				'participation': '='
			},
			controller: eventPublicPageController,
			controllerAs: 'ctrl',
			bindToController: true,
			require: 'eventPublicPage',
			link: link
		};

		function link (scope, elm, attr, ctrl) {

		}
	}

	eventPublicPageController.$inject = ['$state', 'Event'];

	function eventPublicPageController ($state, Event) {
		/*jshint validthis: true */
		var ctrl = this;

		if (!ctrl.event) {
			$state.go('landing');
		}

		ctrl.event.join = function () {
			Event.join($state.params.id).then(
			function (){
				$state.go('event', {'id': $state.params.id});
			},
			function (err) {
				console.log(err);
			});
		};

		ctrl.event.leave = function () {
			Event.leave($state.params.id).then(
			function (){

			},
			function (err) {
				console.log(err);
			});
		};
	}
})();
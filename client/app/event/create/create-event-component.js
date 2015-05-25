(function(){
	'use strict';

	angular
		.module('events.event')
		.directive('createEventPage', createEventPageDirective);

	/**
	 * @ngdoc directive
	 * @name events.event.directive:createEventPage
	 * @restrict E
	 * @scope
	 *
	 * @description
	 * TODO: A description of the directive
	 *
	 * @param {object}  field   TODO: describe attributes to the directive
	 *
	 */

	createEventPageDirective.$inject = [];

	function createEventPageDirective () {
		return {
			restrict: 'E',
			templateUrl: 'app/event/create/create-event.html',
			scope: {},
			controller: createEventPageController,
			controllerAs: 'ctrl',
			bindToController: true,
			require: 'createEventPage'
		};
	}

	createEventPageController.$inject = ['Auth', 'Event'];

	function createEventPageController (Auth, Event) {
		/*jshint validthis: true */
		var ctrl = this;
	}
})();
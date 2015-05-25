(function(){
	'use strict';

	angular
		.module('events.login')
		.directive('', Directive);

	/**
	 * @ngdoc directive
	 * @name events.login.directive:
	 * @restrict E
	 * @scope
	 *
	 * @description
	 * TODO: A description of the directive
	 *
	 * @param {object}  field   TODO: describe attributes to the directive
	 *
	 */

	Directive.$inject = [];

	function Directive () {
		return {
			restrict: 'E',
			scope: {},
			controller: Controller,
			controllerAs: 'ctrl',
			bindToController: true,
			require: '',
			link: link
		};

		function link (scope, elm, attr, ctrl) {

		}
	}

	Controller.$inject = [];

	function Controller () {
		var ctrl = this;

	}
})();
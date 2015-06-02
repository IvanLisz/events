(function(){
	'use strict';

	angular
		.module('events.event')
		.directive('profilePublicPage', profilePublicPageDirective);

	/**
	 * @ngdoc directive
	 * @name events.event.directive:profilePublicPage
	 * @restrict E
	 * @scope
	 *
	 * @description
	 * TODO: A description of the directive
	 *
	 * @param {object}  field   TODO: describe attributes to the directive
	 *
	 */

	profilePublicPageDirective.$inject = [];

	function profilePublicPageDirective () {
		return {
			restrict: 'E',
			templateUrl: 'app/profile/profile-public.html',
			scope: {
				'profile': '='
			},
			controller: profilePublicPageController,
			controllerAs: 'ctrl',
			bindToController: true,
			require: 'profilePublicPage'
		};
	}

	profilePublicPageController.$inject = [];

	function profilePublicPageController () {
		/*jshint validthis: true */
		var ctrl = this;

	}
})();
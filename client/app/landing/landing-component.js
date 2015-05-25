(function(){
	'use strict';

	angular
		.module('events.landing')
		.directive('landingPage', landingPageDirective);

	/**
	 * @ngdoc directive
	 * @name events.landing.directive:landingPage
	 * @restrict E
	 * @scope
	 *
	 * @description
	 * TODO: A description of the directive
	 *
	 * @param {object}  field   TODO: describe attributes to the directive
	 *
	 */

	landingPageDirective.$inject = [];

	function landingPageDirective () {
		return {
			restrict: 'E',
			templateUrl: 'app/landing/landing.html',
			scope: {},
			controller: landingPageController,
			controllerAs: 'ctrl',
			bindToController: true,
			require: 'landingPage',
			link: link
		};

		function link (scope, elm, attr, ctrl) {

		}
	}

	landingPageController.$inject = ['$state', 'Event'];

	function landingPageController ($state, Event) {
		/*jshint validthis: true */
		var ctrl = this;

		var paginationPage = 0;

		ctrl.events = {
			go: goToEvent,
			get: getEvent,
			paginate: getEventsByPagination,
			data: [],
			busy: false,
			noMoreResults: false
		};

		function getEvent (search) {
			return Event.searchByName(search);
		}

		function goToEvent (event) {
			$state.go('event', {'id': event.id});
		}

		function getEventsByPagination () {
			if (ctrl.events.busy) {
				return;
			}
			ctrl.events.busy = true;

			Event.get({ page: paginationPage }).then(
				function (data) {
					paginationPage++;
					if (!data.length) {
						ctrl.events.noMoreResults = true;
					}
					console.log('data');
					console.log(data);
					ctrl.events.data = ctrl.events.data.concat(data);
					ctrl.events.busy = false;
				},
				function (err) {
					// TODO, show error
					ctrl.events.busy = false;
				}
			);
		}
	}
})();
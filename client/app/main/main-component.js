(function(){
	'use strict';

	angular
		.module('events.main')
		.directive('mainPage', mainPageDirective);

	/**
	 * @ngdoc directive
	 * @name events.main.directive:mainPage
	 * @restrict E
	 * @scope
	 *
	 * @description
	 * TODO: A description of the directive
	 *
	 * @param {object}  field   TODO: describe attributes to the directive
	 *
	 */

	mainPageDirective.$inject = ['$window'];

	function mainPageDirective ($window) {
		return {
			restrict: 'E',
			templateUrl: 'app/main/main.html',
			scope: {},
			controller: mainPageController,
			controllerAs: 'ctrl',
			bindToController: true,
			require: 'mainPage',
			link: link
		};

		function link (scope, elm, attr, ctrl) {
			scope.$watch(
				function () {
					return $window.approxLocation;
				}, function () {
					ctrl.approxLocation = getApproxLocation();
				}
			);
		}
	}

	mainPageController.$inject = ['$state', 'Event'];

	function mainPageController ($state, Event) {
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
				function (response) {
					paginationPage++;
					if (!response.data.length) {
						ctrl.events.noMoreResults = true;
					}
					ctrl.events.data = ctrl.events.data.concat(response.data);
					ctrl.events.noMoreResults = response.lastResults;
					ctrl.events.busy = false;
				},
				function (err) {
					// TODO, show error
					ctrl.events.busy = false;
				}
			);
		}
	}

	function getApproxLocation () {
		if (!window.approxLocation) {
			return;
		}
		if (window.approxLocation.city) {
			if (window.approxLocation.regionName) {
				return window.approxLocation.regionName + ', ' + window.approxLocation.city;
			}
			if (window.approxLocation.country) {
				return window.approxLocation.country + ', ' + window.approxLocation.city;
			}
		}
		if (window.approxLocation.regionName) {
			if (window.approxLocation.country) {
				return window.approxLocation.country + ', ' + window.approxLocation.regionName;
			}
			return window.approxLocation.regionName;
		}
		if (window.approxLocation.country) {
			return window.approxLocation.country;
		}
	}
})();
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
			scope: {
				events: '='
			},
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

		var paginationPage = 1;

		ctrl.events = {
			go: goToEvent,
			get: getEvent,
			paginate: getEventsByPagination,
			data: ctrl.events,
			bussy: false
		};

		function getEvent (search) {
			return Event.searchByName(search);
		}

		function goToEvent (event) {
			$state.go('event', {'id': event.id});
		}

		function getEventsByPagination () {
			if (ctrl.events.bussy) {
				return;
			}
			ctrl.events.bussy = true;

			Event.get({ page: paginationPage }).then(
				function (data) {
					console.log('data');
					console.log(data);
					ctrl.data = ctrl.data.concat(data);
				},
				function (err) {
					// TODO, show error
				}
			);
		}

		var Reddit = function() {
			this.items = [];
			this.busy = false;
			this.after = '';
		};

		Reddit.prototype.nextPage = function () {
			if (this.busy) {
				return;
			}
			this.busy = true;

		};
	}
})();
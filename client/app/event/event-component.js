(function(){
	'use strict';

	angular
		.module('events.event')
		.directive('eventPage', eventPageDirective);

	/**
	 * @ngdoc directive
	 * @name events.event.directive:eventPage
	 * @restrict E
	 * @scope
	 *
	 * @description
	 * TODO: A description of the directive
	 *
	 * @param {object}  field   TODO: describe attributes to the directive
	 *
	 */

	eventPageDirective.$inject = [];

	function eventPageDirective () {
		return {
			restrict: 'E',
			templateUrl: 'app/event/event.html',
			scope: {
				'event': '='
			},
			controller: eventPageController,
			controllerAs: 'ctrl',
			bindToController: true,
			require: 'eventPage'
		};
	}

	eventPageController.$inject = ['$state', 'Auth', 'Event'];

	function eventPageController ($state, Auth, Event) {
		/*jshint validthis: true */
		var ctrl = this;

		if (!ctrl.event) {
			$state.go('main');
		}

		ctrl.event.join = function () {
			Event.join($state.params.id).then(
			function (participation) {
				ctrl.participation = participation;
			},
			function (err) {
				console.log(err);
			});
		};

		ctrl.event.leave = function () {
			Event.leave($state.params.id).then(
			function (participation) {
				ctrl.participation = participation;
			},
			function (err) {
				console.log(err);
			});
		};

		function _filterMyParticipation (me) {
			if (!me.id) {
				return false;
			}
			return ctrl.event.participants.filter(function (participant) {
				return participant.id === me.id;
			})[0];
		}

		ctrl.particiation = {};
		Auth.getCurrentUser().then(function (user) {
			ctrl.participation = _filterMyParticipation(user);
			console.log(ctrl.participation);
		});
	}
})();
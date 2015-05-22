(function(){
	'use strict';

	angular
		.module('events.event')
		.directive('eventPrivatePage', eventPrivatePageDirective);

	/**
	 * @ngdoc directive
	 * @name events.event.directive:eventPrivatePage
	 * @restrict E
	 * @scope
	 *
	 * @description
	 * TODO: A description of the directive
	 *
	 * @param {object}  field   TODO: describe attributes to the directive
	 *
	 */

	eventPrivatePageDirective.$inject = [];

	function eventPrivatePageDirective () {
		return {
			restrict: 'E',
			templateUrl: 'app/event/event-private.html',
			scope: {},
			controller: eventPrivatePageController,
			controllerAs: 'ctrl',
			bindToController: true,
			require: 'eventPrivatePage',
			link: link
		};

		function link (scope, elm, attr, ctrl) {

		}
	}

	eventPrivatePageController.$inject = ['$scope', '$http', 'socket'];

	function eventPrivatePageController ($scope, $http, socket) {
		var ctrl = this;

		$scope.awesomeThings = [];

		$http.get('/api/things').success(function(awesomeThings) {
			$scope.awesomeThings = awesomeThings;
			socket.syncUpdates('thing', $scope.awesomeThings);
		});

		$scope.addThing = function() {
			if($scope.newThing === '') {
				return;
			}
			$http.post('/api/things', { name: $scope.newThing });
			$scope.newThing = '';
		};

		$scope.deleteThing = function(thing) {
			$http.delete('/api/things/' + thing._id);
		};

		$scope.$on('$destroy', function () {
			socket.unsyncUpdates('thing');
		});
	}
})();
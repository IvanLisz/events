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

	landingPageController.$inject = ['$state'];

	function landingPageController ($state) {
		/*jshint validthis: true */
		var ctrl = this;

		ctrl.goToEvent = function (event) {
			$state.go('event', {'id': event.originalObject.id});
		};

		/*

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

*/
	}
})();
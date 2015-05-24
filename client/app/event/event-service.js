(function(){
	'use strict';

	angular
		.module('events.event')
		.factory('Event', EventService);

	/**
	 * @ngdoc service
	 * @name events.event.factory:Event
	 *
	 * @description
	 * TODO: Describe this service
	 *
	 */
	EventService.$inject = ['$http', '$q'];

	function EventService ($http, $q) {
		var globalServiceVariable;

		initialize();

		return {
			searchByName: searchByName
		};

		///////////////////////////////////////////

		function initialize () {
			console.log(globalServiceVariable);
		}

		/**
		 * @ngdoc method
		 * @name searchByName
		 * @methodOf events.event.factory:Event
		 *
		 * @description
		 * TODO: searchByName description
		*/
		function searchByName (name) {
			var deferred = $q.defer();

			$http.get('api/events/name/' + name).
			success(function (data) {
				deferred.resolve(data);
			}).
			error(function (err) {
				deferred.reject(err);
			});

			return deferred.promise;
		}
	}
})();
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

		return {
			get: get,
			search: search,
			searchByName: searchByName,
			join: join,
			leave: leave
		};

		///////////////////////////////////////////

		/**
		 * @ngdoc method
		 * @name get
		 * @methodOf events.event.factory:Event
		 *
		 * @description
		 * TODO: get description
		*/
		function get (params) {
			var deferred = $q.defer();

			$http.get('api/events', { params: params }).
			success(function (data) {
				deferred.resolve(data);
			}).
			error(function (err) {
				deferred.reject(err);
			});

			return deferred.promise;
		}

		/**
		 * @ngdoc method
		 * @name search
		 * @methodOf events.event.factory:Event
		 *
		 * @description
		 * TODO: search description
		*/
		function search (id) {
			var deferred = $q.defer();

			$http.get('api/events/' + id).
			success(function (data) {
				deferred.resolve(data);
			}).
			error(function (err) {
				deferred.reject(err);
			});

			return deferred.promise;
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

		/**
		 * @ngdoc method
		 * @name join
		 * @methodOf events.event.factory:Event
		 *
		 * @description
		 * TODO: join description
		*/
		function join (id) {
			var deferred = $q.defer();

			$http.post('api/events/' + id + '/join').
			success(function (data) {
				deferred.resolve(data);
			}).
			error(function (err) {
				deferred.reject(err);
			});

			return deferred.promise;
		}

		/**
		 * @ngdoc method
		 * @name leave
		 * @methodOf events.event.factory:Event
		 *
		 * @description
		 * TODO: leave description
		*/
		function leave (id) {
			var deferred = $q.defer();

			$http.post('api/events/' + id + '/leave').
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
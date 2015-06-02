(function(){
	'use strict';

	angular
		.module('events.profile')
		.factory('Profile', ProfileService);

	/**
	 * @ngdoc service
	 * @name events.profile.factory:Profile
	 *
	 * @description
	 * TODO: Describe this service
	 *
	 */
	ProfileService.$inject = ['$http', '$q'];

	function ProfileService ($http, $q) {

		return {
			get: get
		};

		///////////////////////////////////////////

		/**
		 * @ngdoc method
		 * @name get
		 * @methodOf events.profile.factory:Profile
		 *
		 * @description
		 * TODO: get description
		*/
		function get (name) {
			var deferred = $q.defer();

			$http.get('api/users/' + name + '/profile').
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
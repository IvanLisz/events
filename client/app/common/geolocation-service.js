(function(){
	'use strict';

	angular
		.module('events.common')
		.factory('Geolocation', GeolocationService);

	/**
	 * @ngdoc service
	 * @name events.common.factory:Geolocation
	 *
	 * @description
	 * TODO: Describe this service
	 *
	 */
	GeolocationService.$inject = ['$q', '$http'];

	function GeolocationService ($q, $http) {
		var approx;
		var exact;

		console.log('cotrlol');

		return {
			getApprox: getApprox
		};

		///////////////////////////////////////////

		/**
		 * @ngdoc method
		 * @name getApprox
		 * @methodOf events.common.factory:Geolocation
		 *
		 * @description
		 * TODO: getApprox description
		*/
		function getApprox () {
			console.log('getApprox');
			var deferred = $q.defer();
			$http.get('//l2.io/ip.js?var=myip')
			.success(function (data, status, headers, config) {
				debugger;
				$http.get('http://ip-api.com/json/' + data.myip + '?callback=callback')
				.success(function (data, status, headers, config) {
					debugger;
				})
				.error(function (data, status, headers, config) {
					debugger;
				});
			})
			.error(function (data, status, headers, config) {
				debugger;
			});
			return deferred.promise;
		}
	}
})();
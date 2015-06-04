(function(){
	'use strict';

	angular
		.module('events.badges')
		.factory('Badges', BadgesService);

	/**
	 * @ngdoc service
	 * @name events.badges.factory:Badges
	 *
	 * @description
	 * TODO: Describe this service
	 *
	 */
	BadgesService.$inject = ['$http', '$q'];

	function BadgesService ($http, $q) {
		var badges;

		initialize();

		return {
			get: get
		};

		///////////////////////////////////////////

		function initialize () {
		}

		/**
		 * Get all the available badges
		 *
		 * @return {Promise}
		 */
		function get () {
			var defer = $q.defer();

			if (badges) {
				defer.resolve(badges);				
			} else {
				$http.get('/api/badges').
				success(function (sBadges) {
					badges = sBadges;
					defer.resolve(badges);
				}).
				error(function (err) {
					defer.reject(err);
				});
			}

			return defer.promise;
		}

	}
})();
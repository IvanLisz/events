(function(){
	'use strict';

	angular
		.module('events.auth')
		.factory('Auth', AuthService);

	/**
	 * @ngdoc service
	 * @name events.auth.factory:Auth
	 *
	 * @description
	 * TODO: Describe this service
	 *
	 */
	AuthService.$inject = ['$location', '$rootScope', '$http', 'ipCookie', '$q', 'Facebook'];

	function AuthService ($location, $rootScope, $http, ipCookie, $q, Facebook) {
		var currentUser, loginPromise;

		initialize();

		return {
			login: login,
			loginOauth: loginOauth,
			logout: logout,
			createUser: createUser,
			changePassword: changePassword,
			isLoggedIn: isLoggedIn,
			getCurrentUser: getCurrentUser,
			isAdmin: isAdmin,
			getToken: getToken
		};

		///////////////////////////////////////////

		function initialize () {
			currentUser = {};
			if(getToken()) {
				loginPromise = $q.defer();
				$http.get('/api/users/me').
				success(function (user) {
					currentUser = user;
					loginPromise.resolve(user);
				}).
				error(function (err) {
					logout();
					loginPromise.reject(err);
				});
			}
		}

		/**
		 * Authenticate user and save token
		 *
		 * @param  {Object}   user     - login info
		 * @param  {Function} callback - optional
		 * @return {Promise}
		 */
		function login (user, callback) {
			var cb = callback || angular.noop;
			var deferred = $q.defer();

			$http.post('/auth/local', {
				email: user.email,
				password: user.password
			}).
			success(function(data) {
				ipCookie('token', data.token);
				currentUser = User.get();
				deferred.resolve(data);
				return cb();
			}).
			error(function(err) {
				logout();
				deferred.reject(err);
				return cb(err);
			}.bind(this));

			return deferred.promise;
		}

		/**
		 * Authenticate user and save token
		 *
		 * @param  {String}   provider   - social network to authenticate with
		 * @return {Promise}
		 */
		function loginOauth  (provider) {
			// Because we are trying to login, we reset previous login attempts
			loginPromise = $q.defer();
			switch (provider) {
				case 'facebook':
					Facebook.login(_setFromFacebook, {scope: 'email'});
					break;
			}
			// Return a promise to such attempt
			return loginPromise.promise;
			/*
			$http.get('/auth/' + provider).
			success(function(data) {
				ipCookie('token', data.token);
				currentUser = User.get();
				deferred.resolve(data);
				return cb();
			}).
			error(function(err) {
				logout();
				deferred.reject(err);
				return cb(err);
			}.bind(this));
			*/
		}

		function _setFromFacebook (response) {
			if (response && response.status === 'connected') {
				var data = {
					service: 'facebook',
					service_token: response.authResponse.accessToken
				};

				$http.post('/auth/login', data).
				success(function (logged) {
					setToken(logged.token, logged.expiration);
					currentUser = logged.user;
					loginPromise.resolve(logged.user);
				}).
				error(function(err) {
					logout();
					loginPromise.reject(err);
				});
			} else {
				loginPromise.resolve(false);
			}
		}

		/**
		 * Delete access token and user info
		 *
		 * @param  {Function}
		 */
		function logout () {
			ipCookie.remove('token');
			currentUser = {};
		}

		/**
		 * Create a new user
		 *
		 * @param  {Object}   user     - user info
		 * @param  {Function} callback - optional
		 * @return {Promise}
		 */
		function createUser (user, callback) {
			var cb = callback || angular.noop;

			return User.save(user,
				function(data) {
					ipCookie('token', data.token);
					currentUser = User.get();
					return cb(user);
				},
				function(err) {
					logout();
					return cb(err);
				}.bind(this)).$promise;
		}

		/**
		 * Change password
		 *
		 * @param  {String}   oldPassword
		 * @param  {String}   newPassword
		 * @param  {Function} callback    - optional
		 * @return {Promise}
		 */
		function changePassword (oldPassword, newPassword, callback) {
			var cb = callback || angular.noop;

			return User.changePassword({ id: currentUser._id }, {
				oldPassword: oldPassword,
				newPassword: newPassword
			}, function(user) {
				return cb(user);
			}, function(err) {
				return cb(err);
			}).$promise;
		}

		/*
		* Check if a user is logged in
		* @return {Promise}
		*
		*/
		function isLoggedIn (cb) {
			if (!cb) { cb = angular.noop; }
			if(currentUser.hasOwnProperty('$promise')) {
				currentUser.$promise.then(function() {
					cb(true);
				}).catch(function() {
					cb(false);
				});
			} else if(currentUser.hasOwnProperty('role')) {
				cb(true);
			} else {
				cb(false);
			}
		}


		/**
		 * Gets all available info on authenticated user
		 *
		 * @return {Object} user
		 */
		function getCurrentUser () {
			var deferred = $q.defer();
			isLoggedIn(function (){
				deferred.resolve(currentUser);
			});
			return deferred.promise;
		}

		/**
		 * Check if a user is an admin
		 *
		 * @return {Boolean}
		 */
		function isAdmin () {
			return currentUser.role === 'admin';
		}

		/**
		 * Get auth token
		 */
		function getToken () {
			return ipCookie('token');
		}

		/**
		 * Set auth token
		 */
		function setToken (token, expiration) {
			return ipCookie('token', token, { expirationUnit: 'minutes', expires: expiration });
		}
	}
})();
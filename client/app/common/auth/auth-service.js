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
	AuthService.$inject = ['$http', 'ipCookie', '$q', 'Facebook', 'EventEmmiter'];

	function AuthService ($http, ipCookie, $q, Facebook, EventEmmiter) {
		var currentUser, loginPromise, eventEmmiter;

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
			getToken: getToken,
			onUserChange: onUserChange
		};

		///////////////////////////////////////////

		function initialize () {
			eventEmmiter = new EventEmmiter();
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
					_setToken(logged.token, logged.expiration);
					_setUserChange(logged.user);
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
			_setUserChange({});
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
		function _setToken (token, expiration) {
			return ipCookie('token', token, { expirationUnit: 'minutes', expires: expiration });
		}

		/**
		 * Set auth user
		 */
		function _setUserChange (user) {
			console.log('set change');
			eventEmmiter.trigger('userChange', user);
			return currentUser = user;
		}

		/**
		 * @ngdoc method
		 * @name onUserChange
		 * @methodOf events.auth.factory:Auth
		 *
		 * @description
		 * Registers a handler when a user logs in, logs out, or changes something.
		*/
		function onUserChange (handler) {
			return eventEmmiter.on('userChange', handler);
		}

	}
})();
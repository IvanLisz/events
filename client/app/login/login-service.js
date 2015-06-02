(function(){
	'use strict';

	angular
		.module('events.login')
		.factory('Login', LoginService);

	/**
	 * @ngdoc service
	 * @name events.login.factory:Login
	 *
	 * @description
	 * TODO: Describe this service
	 *
	 */
	LoginService.$inject = ['$mdDialog'];

	function LoginService ($mdDialog) {

		return {
			show: show
		};

		///////////////////////////////////////////

		/**
		 * @ngdoc method
		 * @name show
		 * @methodOf events.login.factory:Login
		 *
		 * @description
		 * TODO: show description
		*/
		function show () {
			$mdDialog.show({
				template: '<md-dialog><ev-login-modal></ev-login-modal></md-dialog>'
			})
			.then(function(answer) {
				console.log('You said the information was "' + answer + '".');
			}, function() {
				console.log('You cancelled the dialog.');
			});
		}
	}
})();
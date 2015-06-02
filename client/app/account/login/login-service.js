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
		var globalServiceVariable;

		initialize();

		return {
			show: show
		};

		///////////////////////////////////////////

		function initialize () {
			console.log(globalServiceVariable);
		}

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
				template: '<ev-login-modal></ev-login-modal>',
			})
			.then(function(answer) {
				$scope.alert = 'You said the information was "' + answer + '".';
			}, function() {
				$scope.alert = 'You cancelled the dialog.';
			});
		}
	}
})();
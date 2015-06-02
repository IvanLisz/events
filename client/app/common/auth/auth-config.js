(function(){
	'use strict';

	angular
		.module('events.auth')
		.config(FacebookConfig);

	FacebookConfig.$inject = ['FacebookProvider'];

	function FacebookConfig (FacebookProvider) {
		FacebookProvider.setSdkVersion('v2.3');
		FacebookProvider.init('590352944439692');
	}
})();

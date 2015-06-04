(function() {
	'use strict';

	angular
		.module('events.common')
		.factory('EventEmmiter', EventEmmiterService);

	/**
	 * @ngdoc service
	 * @name events.common.factory:EventEmmiter
	 *
	 * @description
	 * TODO: Describe this service
	 *
	 */
	EventEmmiterService.$inject = [];

	function EventEmmiterService () {
		
		function EventEmmiter () {
			this.events = {};
		}

		EventEmmiter.prototype.on = function (name, handler) {
			var self = this;
			var handlerId = Math.random();

			if (!this.events.hasOwnProperty(name)) {
				this.events[name] = {};
			}

			this.events[name][handlerId] = handler;

			removeHandler.disposeOnDestroy = function (scope) {
				scope.$on('$destroy', removeHandler);
			};

			function removeHandler () {
				delete self.events[name][handlerId];
			}

			return removeHandler;
		};

		EventEmmiter.prototype.trigger = function (name) {
			// Get the arguments
			var args = [].splice.call(arguments, 1);

			if (this.events[name]) {
				var handlerKeys = Object.keys(this.events[name]);
				for (var i = 0; i < handlerKeys.length ; i++) {
					var handlerKey = handlerKeys[i];
					var handler = this.events[name][handlerKey];
					handler.apply(this, args);
				}
			}
		};

		return EventEmmiter;

	}
})();

(function() {
	'use strict';

	angular
		.module('events.common')
		.directive('evIfAllowed', evIfAllowedDirective);

	/**
	 * @ngdoc directive
	 * @name events.common.directive:evIfAllowed
	 * @restrict A
	 *
	 * @description
	 * Checks if the user has permission to access content.
	 * It can check a particular user id or if the user has an specified role.
	 *
	 * @param {string=}  userId   User id to match user's
	 * @param {string=}  role   Role name
	 *
	 */

	evIfAllowedDirective.$inject = ['$animate', '$parse', 'Auth'];

	function evIfAllowedDirective ($animate, $parse, Auth) {
		// Directive definition
		return {
			restrict: 'EA',
			link: link,
			multiElement: true,
			transclude: 'element',
			priority: 600
		};

		function link (scope, element, attr, ctrl, $transclude) {
			var block, childScope, previousElements;

			// Hide by default
			redraw(false);
			
			// Check if user is authenticated
			Auth.getCurrentUser().then(checkUser);
			Auth.onUserChange(checkUser);

			function checkUser (user) {
				if (user.id) {
					// User ID match
					if (attr.userId !== undefined) {
						if (user.id === $parse(attr.userId)(scope)) {
							redraw(true);
							return;
						}
					}
					// Role match
					if (attr.role !== undefined) {
						if (user[attr.role]) {
							redraw(true);
							return;
						}
					}
					// Logged match
					if (attr.logged === 'true') {
						redraw(true);
						return;
					}
					redraw(false);
				} else {
					// Logged match
					if (attr.logged === 'false') {
						redraw(true);
						return;
					}
					redraw(false);
				}
			};

			function getBlockNodes(nodes) {
				var startNode = nodes[0],
				endNode = nodes[nodes.length - 1];
				if (startNode === endNode) {
					return $(startNode);
				}

				var element = startNode;
				var elements = [element];

				do {
					element = element.nextSibling;
				if (!element) break;
					elements.push(element);
				} while (element !== endNode);

				return $(elements);
			}


			function redraw(value) {
				if (value) {
					if (!childScope) {
						$transclude(function(clone, newScope) {
							childScope = newScope;
							// Note: We only need the first/last node of the cloned nodes.
							// However, we need to keep the reference to the jqlite wrapper as it might be changed later
							// by a directive with templateUrl when its template arrives.
							block = {
							  clone: clone
							};
							$animate.enter(clone, element.parent(), element);
						});
					}
				} else {
					if (previousElements) {
						previousElements.remove();
						previousElements = null;
					}
					if (childScope) {
						childScope.$destroy();
						childScope = null;
					}
					if (block) {
						previousElements = getBlockNodes(block.clone);
						$animate.leave(previousElements).then(function() {
							previousElements = null;
						});
						block = null;
					}
				}
			}
		}

	}

})();

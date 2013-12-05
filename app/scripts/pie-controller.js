'use strict';

angular.module('pie', []).controller('PieController',
		[ '$scope', function($scope) {
			$scope.eatSlice = function() {
				if ($scope.slices) {
					$scope.slices--;
				}
			};
			$scope.slices = 8;
		} ]);
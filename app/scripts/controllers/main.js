'use strict';

angular.module('sheepgridApp')
  .controller('DefaultCtrl', function ($scope) {
  })
 .controller('GlobalCtrl', function ($scope, $location, $state) {
    $scope.$state = $state;
    $scope.$location = $location;
  });

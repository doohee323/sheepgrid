'use strict';

angular.module('sheepgridApp')
.controller('NavbarCtrl', function ($scope, $location) {
	
    $scope.goTo = function ( baseUrl, center, centers ) {
    	var path = baseUrl;
    	if(baseUrl == '/') {
    	} else if(center) {
    		path += center.id;
            if(centers) config.centers = centers;
    	} else if($scope.uip_center[0]) {
    		path += $scope.uip_center[0].id;
    	}
	  	$location.path( path );
	}	
});


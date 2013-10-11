'use strict';

angular.module('sheepgridApp')
.controller('NavbarCtrl', function ($scope, $location) {
	
    $scope.goTo = function ( baseUrl, row ) {
    	var path = baseUrl;
    	if(baseUrl == '/') {
    	} else if(row) {
    		path += row.entity.id;
    	} else if($scope.uip_center[0]) {
    		path += $scope.uip_center[0].id;
    	}
        // if(uip_center) config.centers = uip_center;
	  	$location.path( path );
	}	
});


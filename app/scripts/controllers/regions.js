'use strict';

angular.module('sheepgridApp')
  .controller('RegionsCtrl', function ($scope, $location, $routeParams, RegionService) {
	$scope.$location = $location;
    $scope.newRegion = {};

    $scope.gridOptions = {
        data: 'uip_regions',
        multiSelect: false,  
        enableColumnResize:true, 
        columnDefs: [
        {field:'uip_center_id', displayName:'uip_center_id'},
        {field:'id', displayName:'id'},
        {field:'code', displayName:'code'},
        {field:'region_code', displayName:'region_code'},
        {field:'name', displayName:'name'},
        {field:'chief', displayName:'chief'},
        {field:'address', displayName:'address'}
        ],
        selectedItems: $scope.mySelections,
        afterSelectionChange: function (item) {
            $scope.newRegion = item.entity;
        }
    }

    var center_id = $routeParams.id;
    $scope.center_id = center_id;

    function getRegions() {
        if($scope.uip_center) center_id = $scope.uip_center.id;
        RegionService.get({id: center_id}, function(data) {
            $scope.uip_regions = data.uip_regions;
            $scope.uip_center = angular.copy(config.centers);
            $scope.gridOptions = data.uip_regions;
            if(data.uip_regions.length > 0) {
                $scope.newRegion =  data.uip_regions[0];
            } 
            $scope.regionsTotal = data.uip_regions.length;
            $scope.newRegion.uip_center_id = center_id;
        });
    };

    getRegions();

    $scope.getRegions = function () {
        getRegions();
    };

    $scope.addRegion = function () {
        delete $scope.newRegion.id;
        delete $scope.newRegion.uip_center;
        $scope.newRegion.uip_center_id = center_id;
        var params = {uip_region : $scope.newRegion}; // rails
        if(config.server == 'spring') params = $scope.newRegion; // java
        RegionService.save(params, function (data) {
            data.uip_region.uip_center_id = center_id;
            // delete data.uip_region.id;
            // delete data.uip_region.uip_center;
            $scope.uip_regions.unshift(data.uip_region);
            console.log(data);
        })
    };

	$scope.editRegion = function (region) {
    	$scope.newRegion = region;
    	if(region.uip_center) { // rails
        	$scope.newRegion.uip_center_id = region.uip_center.id;
    	} else { // java
        	$scope.newRegion.uip_center_id = region.uip_center_id;
    	}
    }

    $scope.updateRegion = function (region) {
    	var param = angular.copy($scope.newRegion);
    	delete param.uip_center;
    	var params = {uip_region : param,
    				 id : $scope.newRegion.id}; // rails
    	if(config.server == 'spring') params = params.uip_region; // java
    	RegionService.update(params, function (data) {
    		console.log(data);
    		lookupDs(region.id, function (row){
				$scope.uip_regions[row] = region;
    		});
    	})
    };

    $scope.deleteRegion = function (region) {
    	RegionService.delete({"id" : region.id}, function (data) {
    		console.log(data);
    		lookupDs(region.id, function (row){
    			$scope.uip_regions.splice(row, 1);
    		});
    		$scope.newRegion = {};
    	})
    };

    $scope.initRegion = function () {
    	$scope.newRegion = {};
    }

    $scope.goHomeRegion = function () {
    	var path = '/centers';
	 	$location.path( path );
	}

    $scope.orderby = 'product';
    $scope.reverse = false;

    $scope.setOrder = function (orderby) {
        if (orderby === $scope.orderby)
        {
            $scope.reverse = !$scope.reverse;
        }
        $scope.orderby = orderby;
    };

	var lookupDs = function ( id, callback ) {
    	for (var i = $scope.uip_regions.length - 1; i >= 0; i--) {
    		if ($scope.uip_regions[i].id == (id + '')) {
				callback(i);
				break;
			}
		}
	}

  });

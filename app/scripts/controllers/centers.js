'use strict';

angular.module('sheepgridApp')
  .controller('CentersCtrl', function ($scope, $location, $routeParams, config, CenterService) {
	$scope.$location = $location;

    $scope.updateEntity = function(column, row, cellValue) {
        var data = $scope.uip_centers[row.rowIndex];
        var status = $scope.uip_centers[row.rowIndex].status;
        if(status && status == 'I') {
        } else {
            if(data[column.colDef.field] != cellValue) {
                $scope.uip_centers[row.rowIndex].status = 'U';
            }
        }
        row.entity[column.field] = cellValue;
    };

    $scope.cellValue;
    var checkboxCellTemplate='<div class="ngSelectionCell"><input tabindex="-1" class="ngSelectionCheckbox" type="checkbox" ng-checked="row.selected" /></div>';
    var cellEditableTemplate = "<input style=\"width: 90%\" step=\"any\" type=\"string\" ng-class=\"'colt' + col.index\" ng-input=\"COL_FIELD\" ng-blur=\"updateEntity(col, row, cellValue)\" ng-model='cellValue'/>";
    $scope.gridCenter = {
        data: 'uip_centers',
        multiSelect: false,  
        enableCellSelection: true,
        enableCellEditOnFocus: true,
        enableRowSelection: true,
        enablePinning: true,
        enableSorting: true,
        columnDefs: [
        {field:'CHK', displayName:'chk', width: 50 , 
            cellTemplate:checkboxCellTemplate,
            sortable:false, pinned:false, enableCellEdit: false },
        {field:'status', displayName:'CRUD', width: 50 , sortable:false, pinned:false, enableCellEdit: false },
        {field:'id', displayName:'id', enableCellEdit: false},
        {field:'code', displayName:'code', editableCellTemplate: cellEditableTemplate},
        {field:'name', displayName:'name', editableCellTemplate: cellEditableTemplate},
        {field:'chief', displayName:'chief', editableCellTemplate: cellEditableTemplate},
        {field:'address', displayName:'address', editableCellTemplate: cellEditableTemplate},
        {field:'phone', displayName:'phone', editableCellTemplate: cellEditableTemplate}
        ],
        selectedItems: [],
        afterSelectionChange: function (item) {
            $scope.newRegion = item.entity;
        }
    };

    function getCenters() {
        CenterService.get({}, function(data) {
            $scope.uip_centers = data.uip_centers;
        });
    };

    getCenters();

    $scope.getCenter = function () {
        getCenters();
    };

    $scope.insertCenter = function () {
        var newData = getInitObj($scope.uip_centers[0]);
        newData.status = 'I';
        $scope.uip_centers.unshift(newData);
    };

    $scope.deleteCenter = function () {
        var id = $scope.gridCenter.selectedItems[0].id;
        for (var i = 0; i < $scope.uip_centers.length; i++) {
            if($scope.uip_centers[i].id == id) {
                $scope.uip_centers[i].status = 'D';
                break;
            }
        };
    };

    $scope.initCenter = function () {
        var id = $scope.gridCenter.selectedItems[0].id;
        for (var i = 0; i < $scope.uip_centers.length; i++) {
            if($scope.uip_centers[i].id == id) {
                for (var j = 0; j < Object.keys($scope.uip_centers[i]).length; j++) {
                    $scope.uip_centers[i][Object.keys($scope.uip_centers[i])[j]] = null;
                };
                break;
            }
        };
    };

    $scope.saveCenter = function (center) {
        debugger
        for (var i = 0; i < center.length; i++) {
            if(center[i].status) {
                if(center[i].status == 'I') {
                    var params = {uip_center : center[i]};
                    if(config.server == 'spring') params = center[i]; // java
                    CenterService.save(params, function (data) {
                        $scope.uip_centers.unshift(data.uip_center);
                        console.log(data);
                    })
                } else if(center[i].status == 'U') {
                    var params = {uip_center : center[i],
                                 id : center[i].id};
                    if(config.server == 'spring') params = params.uip_center; // java
                    CenterService.update(params, function (data) {
                        console.log(data);
                        lookupDs(center.id, function (row){
                            $scope.uip_centers[row] = center;
                        });
                    })
                } else if(center[i].status == 'D') {
                    CenterService.delete({"id" : center.id}, function (data) {
                        console.log(data);
                        lookupDs(center.id, function (row){
                            $scope.uip_centers.splice(row, 1);
                        });
                    })
                }
            }
        };
    };

	var lookupDs = function ( id, callback ) {
    	for (var i = $scope.uip_centers.length - 1; i >= 0; i--) {
    		if ($scope.uip_centers[i].id == (id + '')) {
				callback(i);
				break;
			}
		}
	}

    var getInitObj = function(source) {
        var data = angular.copy(source);
        for (var i = 0; i < Object.keys(data).length; i++) {
            data[Object.keys(data)[i]] = null;
        };
        return data;
    };

  });

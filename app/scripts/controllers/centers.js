'use strict';

angular.module('sheepgridApp')
  .controller('CentersCtrl', function ($scope, $location, $routeParams, $timeout, config, CenterService) {
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
            for (var i = 0; i < data.uip_centers.length; i++) {
                data.uip_centers[i].status = 'R';
            };
            $scope.uip_centers = data.uip_centers;
        });
    };

    getCenters();

    $scope.$on('ngGridEventData', function (e,s) {
        if($scope.gridCenter.selectRow) {
            $scope.gridCenter.selectRow(0, true);
            $(".ngViewport").focus();
        }
    });    

    $scope.getCenter = function () {
        getCenters();
    };

    $scope.insertCenter = function () {
        var data = $scope.gridCenter.columnDefs;
        var newData = getAddRow(data);
        newData.status = 'I';
        $scope.uip_centers.unshift(newData);

        var selectRow = function() {
            $scope.gridCenter.selectRow(0, true);
            //$($($(".ngCellText.col3.colt1")[1]).parent()).parent().focus();
        }
        $timeout(selectRow, 500);
    };

    $scope.deleteCenter = function () {
        var id = $scope.gridCenter.selectedItems[0].id;
        for (var i = 0; i < $scope.uip_centers.length; i++) {
            if($scope.uip_centers[i].id == id) {
                if($scope.uip_centers[i].status == 'I') {
                    $scope.uip_centers.splice(i, 1);
                } else {
                    $scope.uip_centers[i].status = 'D';
                }
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

    $scope.saveCenter = function () {
        var dataset = $scope.uip_centers;
        for (var i = 0; i < dataset.length; i++) {
            var status = dataset[i].status;
            var currow = i;
            delete dataset[i].status;
            if(status == 'I') {
                var params = {uip_center : dataset[i]};
                if(config.server == 'spring') params = dataset[i]; // java
                CenterService.save(params, function (data) {
                    $scope.uip_centers[0].id = data.uip_center.id;
                })
            } else if(status == 'U') {
                var params = {uip_center : dataset[i],
                             id : dataset[i].id};
                if(config.server == 'spring') params = params.uip_center; // java
                CenterService.update(params, function (data) {
                    $scope.uip_centers[currow] = data.uip_center;
                })
            } else if(status == 'D') {
                CenterService.delete({"id" : dataset[i].id}, function (data) {
                    $scope.uip_centers.splice(currow, 1);
                })
            }
            $scope.uip_centers[i].status = 'R';
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

    var getAddRow = function(source) {
        var data = angular.copy(source);
        var target = {};
        for (var i = 0; i < data.length; i++) {
            if(data[i].field && data[i].field != 'CHK') {
                target[data[i].field] = null;
            }
        };
        return target;
    };

    // var getInitObj = function(source) {
    //     var data = angular.copy(source);
    //     debugger
    //     for (var i = 0; i < Object.keys(data).length; i++) {
    //         data[Object.keys(data)[i]] = null;
    //     };
    //     return data;
    // };

  });

'use strict';

angular.module('sheepgridApp')
  .controller('CentersCtrl', function ($scope, $location, $routeParams, $timeout, config, CenterService, CommongridService) {
	$scope.$location = $location;

    $scope.cellValue;
    var checkboxCellTemplate='<div class="ngSelectionCell"><input tabindex="-1" class="ngSelectionCheckbox" type="checkbox" ng-checked="row.selected" /></div>';
    var cellEditableTemplate = "<input style=\"width: 90%\" step=\"any\" type=\"string\" ng-class=\"'colt' + col.index\" ng-input=\"COL_FIELD\" ng-blur=\"updateEntity(col, row, cellValue)\" ng-model='cellValue'/>";
    $scope.gridCenter = {
        data: 'uip_center',
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
        {field:'link', displayName:'link', width: 80, cellTemplate: '<div><button ng-click="goTo(\'/regions/\', row)">to region</button></div>'},
        {field:'id', displayName:'id', enableCellEdit: false},
        {field:'code', displayName:'code', enableCellEdit: true},
        {field:'name', displayName:'name', enableCellEdit: true},
        {field:'chief', displayName:'chief', enableCellEdit: true},
        {field:'address', displayName:'address', enableCellEdit: true},
        {field:'phone', displayName:'phone', enableCellEdit: true}
        ],
        selectedItems: [],
        afterSelectionChange: function (item) {
            $scope.newRegion = item.entity;
        }
    };
	
	CommongridService.init($scope, $timeout, config, CenterService, 'gridCenter');
	
  });

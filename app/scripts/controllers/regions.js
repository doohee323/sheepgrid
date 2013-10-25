'use strict';

app.controller('RegionsCtrl', function ($scope, $location, $stateParams, $timeout, $state, config, RegionService, CommongridService) {
	$scope.$location = $location;

    $scope.cellValue;
    var checkboxCellTemplate='<div class="ngSelectionCell"><input tabindex="-1" class="ngSelectionCheckbox" type="checkbox" ng-checked="row.selected" /></div>';
    var cellEditableTemplate = "<input style=\"width: 90%\" step=\"any\" type=\"string\" ng-class=\"'colt' + col.index\" ng-input=\"COL_FIELD\" ng-blur=\"updateEntity(col, row, cellValue)\" ng-model='cellValue'/>";
    $scope.gridRegion = {
        data: 'uip_region',
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
        {field:'uip_center_id', displayName:'uip_center_id', enableCellEdit: false},
        {field:'id', displayName:'id', enableCellEdit: false},
        {field:'code', displayName:'code', editableCellTemplate: cellEditableTemplate},
        {field:'region_code', displayName:'region_code', editableCellTemplate: cellEditableTemplate},
        {field:'name', displayName:'name', editableCellTemplate: cellEditableTemplate},
        {field:'chief', displayName:'chief', editableCellTemplate: cellEditableTemplate},
        {field:'address', displayName:'address', editableCellTemplate: cellEditableTemplate}
        ],
        selectedItems: [],
        afterSelectionChange: function (item) {
            $scope.newRegion = item.entity;
        }
    };
    
    debugger;
    var params = {uip_center_id: $stateParams.id};
    CommongridService.init($scope, $timeout, config, RegionService, 'gridRegion', params);

    $scope.goHomeData = function () {
        var path = '/centers';
        $state.go('default.centers');
        //$location.path( path );
    }

  });

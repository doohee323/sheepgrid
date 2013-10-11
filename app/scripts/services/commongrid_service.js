'use strict';

angular.module('sheepgridApp')
.service('CommongridService', function () {

	var _dataset = null;	// ex) uip_center
	var _dataset2 = null;	// ex) uip_centers
	
	this.init = function($scope, $timeout, config, service, grid, input) {
		_dataset = $scope[grid].data;
		_dataset2 = _dataset + 's';

	    $scope.updateEntity = function(column, row, cellValue) {
	        var data = $scope[_dataset][row.rowIndex];
	        var status = $scope[_dataset][row.rowIndex].status;
	        if(status && status == 'I') {
	        } else {
	            if(data[column.colDef.field] != cellValue) {
	                $scope[_dataset][row.rowIndex].status = 'U';
	            }
	        }
	        row.entity[column.field] = cellValue;
	    };

	    function getDatas(input) {
	    	var params = {};
	    	debugger
	    	if(input) params = input;
	        service.get(params, function(data) {
	            for (var i = 0; i < data[_dataset2].length; i++) {
	                data[_dataset2][i].status = 'R';
	            };
	            $scope[_dataset] = data[_dataset2];
	        });
	    };

	    debugger
	    getDatas(input);

	    $scope.$on('ngGridEventData', function (e,s) {
	        if($scope[grid].selectRow) {
	            $scope[grid].selectRow(0, true);
	            $(".ngViewport").focus();
	        }
	    });    

	    $scope.retrieveData = function (input) {
	        getDatas(input);
	    };

	    $scope.insertData = function () {
	        var data = $scope[grid].columnDefs;
	        var newData = getAddRow(data);
	        newData.status = 'I';
	        $scope[_dataset].unshift(newData);

	        var selectRow = function() {
	            $scope[grid].selectRow(0, true);
	            //$($($(".ngCellText.col3.colt1")[1]).parent()).parent().focus();
	        }
	        $timeout(selectRow, 500);
	    };

	    $scope.deleteData = function () {
	        var id = $scope[grid].selectedItems[0].id;
	        for (var i = 0; i < $scope[_dataset].length; i++) {
	            if($scope[_dataset][i].id == id) {
	                if($scope[_dataset][i].status == 'I') {
	                    $scope[_dataset].splice(i, 1);
	                } else {
	                    $scope[_dataset][i].status = 'D';
	                }
	            }
	        };
	    };

	    $scope.initData = function () {
	        var id = $scope[grid].selectedItems[0].id;
	        for (var i = 0; i < $scope[_dataset].length; i++) {
	            if($scope[_dataset][i].id == id) {
	                for (var j = 0; j < Object.keys($scope[_dataset][i]).length; j++) {
	                    $scope[_dataset][i][Object.keys($scope[_dataset][i])[j]] = null;
	                };
	                break;
	            }
	        };
	    };

	    $scope.saveData = function () {
	        var dataset = $scope[_dataset];
	        for (var i = 0; i < dataset.length; i++) {
	            var status = dataset[i].status;
	            var currow = i;
	            delete dataset[i].status;
	            var params = {};
	            if(status == 'I') {
	                params[_dataset] = dataset[i];
	                if(config.server == 'spring') params = dataset[i]; // java
	                service.save(params, function (data) {
	                    $scope[_dataset][0].id = data[_dataset].id;
	                })
	            } else if(status == 'U') {
	            	params[_dataset] = dataset[i];
	            	params.id = dataset[i].id;
	                if(config.server == 'spring') params = params[_dataset]; // java
	                service.update(params, function (data) {
	                    $scope[_dataset][currow] = data[_dataset];
	                })
	            } else if(status == 'D') {
	                service.delete({"id" : dataset[i].id}, function (data) {
	                    $scope[_dataset].splice(currow, 1);
	                })
	            }
	            $scope[_dataset][i].status = 'R';
	        };
	    };

		var lookupDs = function ( id, callback ) {
	    	for (var i = $scope[_dataset].length - 1; i >= 0; i--) {
	    		if ($scope[_dataset][i].id == (id + '')) {
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
	}
	
});





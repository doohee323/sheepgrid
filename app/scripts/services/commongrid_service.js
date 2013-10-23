'use strict';

angular.module('sheepgridApp')
.service('CommongridService', function (socket) {

	var _dataset = null;	// ex) uip_center
	var _dataset2 = null;	// ex) uip_centers
	var _input = null;	// params
	
	this.init = function($scope, $timeout, config, service, grid, input) {
		_dataset = $scope[grid].data;
		_dataset2 = _dataset + 's';
		_input = input;

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
	    	if(input) params = input;
	        service.get(params, function(data) {
	            for (var i = 0; i < data[_dataset2].length; i++) {
	                data[_dataset2][i].status = 'R';
	            };
	            $scope[_dataset] = data[_dataset2];
	        });
	    };

	    getDatas(_input);

	    $scope.$on('ngGridEventData', function (e,s) {
	        if($scope[grid].selectRow) {
	            $scope[grid].selectRow(0, true);
	            $(".ngViewport").focus();
	        }
	    });    

//		socket.on('connect', function() {
//			$('#content_log').text('Connected');
//		});

//		socket.on('centers', function(msg) {
//			$('#content_log').append($('<p>').text(msg).append(
//					$('<em>').text(' from server')));
//			console.log(msg);
//		});
		
//	    socket.on('message', function(msg) {
//	    	$('#content_log').append($('<p>').text(msg).append(
//						$('<em>').text(' from server')));
//		});
	    
		socket.on('inserted', function(data) {
			$('#content_log').text(data);
			$scope[_dataset].unshift(data[_dataset]);
			$scope.retrieveData();
		});	

		$scope.$watch(_dataset, function() {
	         console.log('------------------');
	    }, true);
		
		$scope.testData = function () {
			debugger;
			var _dataset = 'uip_center';
			var row = $scope[_dataset].length - 1;
	        $scope[_dataset][row + 1] = $scope[_dataset][row];
	    };

		socket.on('updated', function(data, rootScope) {
			$('#content_log').text(data);
			lookupDs(data.id, function (row){
				//$scope[_dataset][row] = data;
				$scope.setData2(row, data);
			});
//			$scope.retrieveData();
		});	

		$scope.setData2 = function (row, data) {
			$timeout(function() {
				data.status = 'R';
				debugger;
				$scope[_dataset][row] = data; 
			}, 1000);
	    };		
		
		socket.on('deleted', function(data) {
			$('#content_log').text(data);
			lookupDs(data, function (row){
				$scope[_dataset].splice(row, 1);
			});
			$scope.newregion = {};
			$scope.retrieveData();
		});	
	    
	    $scope.retrieveData = function (input) {
	    	if(_input) input = _input;
	        getDatas(input);
	        
		    if(config.socketLogined == false) {
		    	config.socketLogined = true;
				socket.emit('centers', 'centers');
		    }
	    };

	    $scope.insertData = function () {
	        var data = $scope[grid].columnDefs;
	        var newData = getAddRow(data);
	        if(_input) newData = mergeData(_input, newData);
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
	            		socket.emit('insert', $scope[_dataset][0]);
	                })
	            } else if(status == 'U') {
	            	params[_dataset] = dataset[i];
	            	params.id = dataset[i].id;
	                if(config.server == 'spring') params = params[_dataset]; // java
	                service.update(params, function (data) {
	                    $scope[_dataset][currow] = data[_dataset];
	                    socket.emit('update', $scope[_dataset][currow]);
	                })
	            } else if(status == 'D') {
	                service.delete({"id" : dataset[i].id}, function (data) {
	                	socket.emit('delete', $scope[_dataset][currow].id);
	                    $scope[_dataset].splice(currow, 1);
	                })
	            }
	            $scope[_dataset][i].status = 'R';
	        };
	    };

		var lookupDs = function ( id, callback ) {
	    	for (var i = 0; i < $scope[_dataset].length; i++) {
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
	            if(data[i].field 
	            	&& data[i].field != 'link'
	            	&& data[i].field != 'CHK') {
	                target[data[i].field] = null;
	            }
	        };
	        return target;
	    };		

	    var mergeData = function(source, target) {
	        for (var j = 0; j < Object.keys(source).length; j++) {
                target[Object.keys(source)[j]] = source[Object.keys(source)[j]];
            };
	        return target;
	    };
	}
	
});





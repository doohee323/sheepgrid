'use strict';

app.directive('ngExcel', function($compile, $timeout, config, socket){
	
	var _service;
	var _grid;
	var _dataset;	// ex) uip_center
	var _datasets;	// ex) uip_centers
	var _input;		// params
	
	var getTemplate = function(grid) {
		return "<div ng-grid=\"" + grid + "\" ng-style=\"myprop()\"></div>";
	};
	
	var linker = function(scope, element, attr) {
		_grid = attr['id'];
		_dataset = attr['data'];

		scope.gridInit = function(service, columnDefs, input) {
			_service = service;
			_input = input;
			_datasets = _dataset + 's';
			
			scope[_grid] = {
			        data: _dataset,
			        multiSelect: false,  
			        enableCellSelection: true,
			        enableCellEditOnFocus: true,
			        enableRowSelection: true,
			        enablePinning: true,
			        enableSorting: true,
			        columnDefs: columnDefs,
			        selectedItems: []
			    };
			
			element.html(getTemplate(_grid)).show();
//			element.bind('click', function() {
//				eval('scope.' + attr["type"] + attr["data"] + '()');
//				return;
//			});
			$compile(element.contents())(scope);
			
			scope[_grid].attr = attr;
		};		
		
		scope.updateEntity = function(column, row, cellValue) {
	        var data = scope[_dataset][row.rowIndex];
	        var status = scope[_dataset][row.rowIndex].status;
	        if(status && status == 'I') {
	        } else {
	            if(data[column.colDef.field] != cellValue) {
	                scope[_dataset][row.rowIndex].status = 'U';
	            }
	        }
	        row.entity[column.field] = cellValue;
	    };
		
		scope.$watch(_dataset, function(newData){
			scope.myprop = function() {
				var attr = scope[_grid].attr;
				if(attr) {
		            return {
		                width: attr["width"] + 'px',
		                height: attr["height"] + 'px'
		            };
				} else {
					return {};
				}
	        };
		}, true);

		scope.getDatas = function(input) {
	    	var params = {};
	    	if(input) params = input;
	    	_service.get(params, function(data) {
	            for (var i = 0; i < data[_datasets].length; i++) {
	                data[_datasets][i].status = 'R';
	            };
	            scope[_dataset] = data[_datasets];
			    if(config.socketUse && config.socketLogined == false) {
			    	config.socketLogined = true;
					socket.emit('centers', 'centers');
			    }
	        });
	    };

	    scope.retrieveData = function (input) {
	    	if(_input) input = _input;
	    	scope.getDatas(input);
	    };

	    scope.insertData = function () {
	        var data = scope[_grid].columnDefs;
	        var newData = getAddRow(data);
	        if(_input) newData = mergeData(_input, newData);
	        newData.status = 'I';
	        scope[_dataset].unshift(newData);

	        var selectRow = function() {
	            scope[_grid].selectRow(0, true);
	            //$($($(".ngCellText.col3.colt1")[1]).parent()).parent().focus();
	        }
	        $timeout(selectRow, 500);
	    };

	    scope.deleteData = function () {
	        var id = scope[_grid].selectedItems[0].id;
	        for (var i = 0; i < scope[_dataset].length; i++) {
	            if(scope[_dataset][i].id == id) {
	                if(scope[_dataset][i].status == 'I') {
	                    scope[_dataset].splice(i, 1);
	                } else {
	                    scope[_dataset][i].status = 'D';
	                }
	            }
	        };
	    };

	    scope.initData = function () {
	    	if(!scope[_grid].selectedItems[0]) return;
	        var id = scope[_grid].selectedItems[0].id;
	        for (var i = 0; i < scope[_dataset].length; i++) {
	            if(scope[_dataset][i].id == id) {
	                for (var j = 0; j < Object.keys(scope[_dataset][i]).length; j++) {
	                    scope[_dataset][i][Object.keys(scope[_dataset][i])[j]] = null;
	                };
	                break;
	            }
	        };
	    };

	    scope.saveData = function () {
	        var dataset = scope[_dataset];
	        for (var i = 0; i < dataset.length; i++) {
	            var status = dataset[i].status;
	            var currow = i;
	            delete dataset[i].status;
	            var params = {};
	            if(status == 'I') {
	                params[_dataset] = dataset[i];
	                if(config.server == 'spring') params = dataset[i]; // java
	                _service.save(params, function (data) {
	                    scope[_dataset][0].id = data[_dataset].id;
	                    if(config.socketUse)
	                    	socket.emit('insert', scope[_dataset][0]);
	                })
	            } else if(status == 'U') {
	            	params[_dataset] = dataset[i];
	            	params.id = dataset[i].id;
	                if(config.server == 'spring') params = params[_dataset]; // java
	                _service.update(params, function (data) {
	                    scope[_dataset][currow] = data[_dataset];
	                })
                    if(config.socketUse)
                    	socket.emit('update', scope[_dataset][currow]);
	            } else if(status == 'D') {
	            	scope.uip_center.curid = dataset[i].id;
            		_service.delete({"id" : dataset[i].id}, function (data) {
            			lookupDs(scope.uip_center.curid, function (row){
							scope[_dataset].splice(row, 1);
						});
                	})
                    if(config.socketUse)
	                	socket.emit('delete', scope[_dataset][currow].id);
	            }
	            scope[_dataset][i].status = 'R';
	        };
	    };

		var lookupDs = function ( id, callback ) {
	    	for (var i = 0; i < scope[_dataset].length; i++) {
	    		if (scope[_dataset][i].id == (id + '')) {
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

	    ///////////////////////////////////////////////////////////////////////
	    // socket.io callback func begin
	    ///////////////////////////////////////////////////////////////////////
        if(config.socketUse) {
    		socket.on('inserted', function(data) {
    			$('#content_log').text(data);
    			scope[_dataset].unshift(data);
    		});	

    		socket.on('updated', function(data, rootScope) {
    			$('#content_log').text(data);
    			// scope 문제로 정상 호출되지 않아 임의로 조회함
    			// - 상세 설명 : socket.io 에 의해서 호출되었을 경우 $scope.apply 가 제대로 이루어지지 않아 binding을 할수 없음
    			// 원인은 ng-grid의 cell 에대한 변경여부를 확인하기 위해서 기술된 cellEditableTemplate 에 별도의 scope가 추가되었기 때문임
    			// 변경된 값을 인지하는 방법의 변경이 필요함
    			scope.retrieveData();

    			// lookupDs(data.id, function (row){
    			// 	//scope[_dataset][row] = data;
    			// 	$timeout(function() {
    			// 		data.status = 'R';
    			// 		scope[_dataset][row] = data; 
    			// 	}, 500);
    			// });
    			// $timeout(function() {
    			// 	document.getElementById("retrieveCenter").click();
    			// }, 1000);
    		});	
    		
    		socket.on('deleted', function(data) {
    			$('#content_log').text(data);
    			lookupDs(data, function (row){
    				scope[_dataset].splice(row, 1);
    			});
    		});	
        }
	    ///////////////////////////////////////////////////////////////////////
	    // socket.io callback func end
	    ///////////////////////////////////////////////////////////////////////
	};
	
	return {
		restrict : 'EA',
		link : linker,
		replace : true
	};
});
'use strict';

app.directive('ngExcel', function($compile, $timeout, config){
	
	var _service = null;
	var _grid = null;
	var _dataset = null;	// ex) uip_center
	var _datasets = null;	// ex) uip_centers
	var _input = null;	// params
	
	var getTemplate = function(_grid) {
		return "<div ng-grid=\"" + _grid + "\" ng-style=\"myprop()\"></div>";
	};
	
	var linker = function(scope, element, attr) {
		debugger;
		_grid = attr['id'];
		_dataset = attr['data'];

		scope[_grid] = {
		        data: _dataset,
		        multiSelect: false,  
		        enableCellSelection: true,
		        enableRowSelection: true,
		        enableSorting: true,
		        columnDefs: 'columnDefs',
		        selectedItems: []
		    };
		
		element.html(getTemplate(_grid)).show();
//		element.bind('click', function() {
//			eval('scope.' + attr["type"] + attr["data"] + '()');
//			return;
//		});
		$compile(element.contents())(scope);
		
		scope.gridInit = function(service, input) {
			debugger;
			_service = service;
			_dataset = scope[_grid].data;
			_datasets = _dataset + 's';
			_input = input;
		}				
		
		scope.updateEntity = function(column, row, cellValue) {
			debugger;
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
		
		scope[_grid].attr = attr;
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
			console.log(newData);
		}, true);

		scope.getDatas = function(input) {
	    	var params = {};
	    	debugger;
	    	if(input) params = input;
	    	_service.get(params, function(data) {
	            for (var i = 0; i < data[_datasets].length; i++) {
	                data[_datasets][i].status = 'R';
	            };
	            scope[_dataset] = data[_datasets];
	        });
	    };
		
	};
	
	return {
		restrict : 'EA',
		link : linker,
		replace : true
	};
});